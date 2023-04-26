import { useCallback, useState } from "react";
import { Switcher } from "@/components/elements/Switcher";
import { Libp2pNodeSwitcherProps } from "./Libp2pNodeSwitcher.types";

const Libp2pNodeSwitcher: React.FC<Libp2pNodeSwitcherProps> = ({
  libp2pNode,
}) => {
  const [isNodeOnline, setIsNodeOnline] = useState(!!libp2pNode?.isStarted());
  const [isNodeLoading, setIsNodeLoading] = useState(false);

  const toggleNode = useCallback(() => {
    const toggle = async () => {
      if (!libp2pNode) return;

      setIsNodeLoading(true);

      if (isNodeOnline) {
        await libp2pNode.stop();
      } else {
        await libp2pNode.start();
      }

      setIsNodeLoading(false);
      setIsNodeOnline(!isNodeOnline);
    };

    toggle();
  }, [isNodeOnline, libp2pNode]);

  return (
    <Switcher
      id="Libp2pNodeSwitcher"
      isChecked={isNodeOnline}
      isDisabled={isNodeLoading}
      handleToggle={toggleNode}
    >
      {`P2P Node ${
        isNodeLoading ? "Loading" : isNodeOnline ? "Online" : "Offline"
      }`}
    </Switcher>
  );
};

export { Libp2pNodeSwitcher };
