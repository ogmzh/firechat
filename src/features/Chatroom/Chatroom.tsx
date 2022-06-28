import { ChannelEntity } from '../../shared/Types';

export default function Chatroom({ selectedChannel }: { selectedChannel: ChannelEntity }) {
  return <div>{selectedChannel.name}</div>;
}
