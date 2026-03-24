import { useSocketContext } from '../context/SocketContext';

export function useSocket() {
    return useSocketContext();
}

export default useSocket;
