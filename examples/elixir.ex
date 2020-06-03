defmodule WasmexTest do
  use GenServer

  def init([]) do
    {:ok, bytes} = File.read("break_iterator.wasm")
    {:ok, instance} = Wasmex.start_link(%{
      bytes: bytes,
      imports: %{
        wasi_snapshot_preview1: %{
          proc_exit: {:fn, [:i32], [], fn _ -> 0 end},
          fd_close: {:fn, [:i32], [:i32], fn _ -> 0 end},
          environ_sizes_get: {:fn, [:i32, :i32], [:i32], fn _ -> 0 end},
          environ_get: {:fn, [:i32, :i32], [:i32], fn _ -> 0 end}
          },
          env: %{
            __sys_stat64: {:fn, [:i32, :i32], [:i32], fn _ -> 0 end},
          push: {:fn, [:i32, :i32, :i32], [], fn (%{memory: memory}, slice_start, slice_end, type) ->
            pid_binary_length = Wasmex.Memory.get(memory, 100)
            pid = Wasmex.Memory.read_string(memory, 101, pid_binary_length) |> Base.decode64! |> :erlang.binary_to_term
            send(pid, {:received_value, {slice_start, slice_end, type}})
            nil
          end },
        }
      }
    })

    {:ok, instance}
  end

  def handle_call({:break, locale, string}, _from, instance) do
    string = string <> <<0>>
    {:ok, memory} = Wasmex.memory(instance, :uint8, 0)

    breaks = Task.async(fn ->
      pid = self()
      pid_binary = :erlang.term_to_binary(self()) |> Base.encode64

      Wasmex.Memory.write_binary(memory, 0, locale <> <<0>>)
      Wasmex.Memory.set(memory, 100, byte_size(pid_binary))
      Wasmex.Memory.write_binary(memory, 101, pid_binary)
      Wasmex.Memory.write_binary(memory, 10000, string)

      Task.async(fn ->
        Wasmex.call_function(instance, "break_iterator", [0, 10000, byte_size(string)])
        send(pid, :done)
      end)

      receive_all_values()
    end) |> Task.await

    reply = breaks |> Enum.map(fn {slice_start, slice_end, type} ->
      {slice_start, slice_end, type, string |> binary_part(slice_start, slice_end - slice_start)}
      # {string |> String.slice(slice_start, slice_end - slice_start), type}
    end)

    {:reply, {reply, memory}, instance}
  end

  def receive_all_values(values \\ []) do
    receive do
      :done -> values |> Enum.reverse
      {:received_value, value} -> receive_all_values( [value | values])
    end
  end
end
