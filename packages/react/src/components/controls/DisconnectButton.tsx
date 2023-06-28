import { ConnectionState } from 'livekit-client';
import { setupDisconnectButton } from '@livekit/components-core';
import * as React from 'react';
import { toast } from 'react-hot-toast';
import { useRoomContext } from '../../context';
import { useConnectionState } from '../ConnectionState';
import { mergeProps } from '../../utils';

/** @public */
export type DisconnectButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  stopTracks?: boolean;
};

/** @public */
export function useDisconnectButton(props: DisconnectButtonProps) {
  const room = useRoomContext();
  const connectionState = useConnectionState(room);

  const buttonProps = React.useMemo(() => {
    const { className, disconnect } = setupDisconnectButton(room);
    const mergedProps = mergeProps(props, {
      className,
      onClick: () => {
        toast(
          (t) => (
            <div className="space-y-2">
              <p>Are you sure you want to leave?</p>
              <div className="space-x-2">
                <button
                  className="rounded-md bg-brand-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                  onClick={async () => {
                    if (room?.name) {
                      const result = await fetch(
                        `https://faceto-ai.withcontext.ai/${room?.name}/transcript`,
                        { method: 'POST' },
                        // `https://ai-interview.withcontext.ai/v1/chat/transcript`,
                        // {
                        //   method: 'POST',
                        //   headers: { 'Content-Type': 'application/json' },
                        //   body: JSON.stringify({ name: '9ls0-azyg' }),
                        // },
                      ).then((res) => res.json());
                      console.log('transcript result:', result);
                      const transcript = result?.transcript?.list;
                      if (transcript) {
                        sessionStorage.setItem('transcript', JSON.stringify(transcript));
                      }
                    }
                    disconnect(props.stopTracks ?? true);
                    toast.dismiss(t.id);
                  }}
                >
                  Leave
                </button>
                <button
                  className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  onClick={() => toast.dismiss(t.id)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ),
          {
            position: 'bottom-right',
            duration: Infinity,
          },
        );
      },
      disabled: connectionState === ConnectionState.Disconnected,
    });
    return mergedProps;
  }, [room, props, connectionState]);

  return { buttonProps };
}

/**
 * The DisconnectButton is a basic html button with the added ability to disconnect from a LiveKit room.
 * Normally, it is used by end-users to leave a video or audio call.
 *
 * @example
 * ```tsx
 * <LiveKitRoom>
 *   <DisconnectButton>Leave room</DisconnectButton>
 * </LiveKitRoom>
 * ```
 * @public
 */
export function DisconnectButton(props: DisconnectButtonProps) {
  const { buttonProps } = useDisconnectButton(props);
  return <button {...buttonProps}>{props.children}</button>;
}
