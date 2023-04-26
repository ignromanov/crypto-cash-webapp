import { Libp2p, createLibp2p } from "libp2p";
import { noise } from "@chainsafe/libp2p-noise";
import { yamux } from "@chainsafe/libp2p-yamux";
import { webTransport } from "@libp2p/webtransport";
import { bootstrap } from "@libp2p/bootstrap";
import { kadDHT } from "@libp2p/kad-dht";
import axios from "axios";
import { ipfsGatewayUrl } from "@/constants";

let libp2pNode: Libp2p;

const createLibp2pNode = async () => {
  if (libp2pNode) {
    return libp2pNode;
  }

  // const wrtcStar = webRTCStar();

  // TODO: Let our libp2p node works properly
  // Create our libp2p node
  libp2pNode = await createLibp2p({
    // addresses: {
    //   // Add the signaling server address, along with our PeerId to our multiaddrs list
    //   // libp2p will automatically attempt to dial to the signaling server so that it can
    //   // receive inbound connections from other peers
    //   listen: [
    //     "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
    //     "/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star",
    //   ],
    // },
    transports: [webTransport()],
    connectionEncryption: [noise()],
    connectionManager: {
      maxConnections: 150,
      maxParallelDials: 150,
      dialTimeout: 10e3,
    },
    streamMuxers: [yamux()],
    dht: kadDHT(),
    peerDiscovery: [
      // wrtcStar.discovery,
      bootstrap({
        list: [
          "/ip4/3.125.128.80/udp/9095/quic-v1/webtransport/certhash/uEiAGIlVdiajNz0k1RHjrxlNXN5bb7W4dLPvMJYUrGJ9ZUQ/certhash/uEiDYZsZoO8vuTKlPhxvVR5SFwOkbXfjlsmTLUHNlnG24bg/p2p/12D3KooWEymoJRHaxizLrrKgJ9MhEYpG85fQ7HReRMJuEMLqmNMg",
          "/ip4/18.195.246.16/udp/9090/webrtc-direct/certhash/uEiA8EDMfADmULSe2Bm1vVDSmN2RQPvY5MXkEZVOSyD1y2w/p2p/12D3KooWSmtsbL2ukwVwf8gDoTYZHnCd7sVNNVdMnCa4MkWjLujm",
          "/ip4/168.220.93.39/udp/4003/quic/webtransport/certhash/uEiBYCfrOOzbaE7TlUFJ-4fCpWArzaCWr5DPutnOk7kNxOA/certhash/uEiAAJDKUhVQslO54iSO9niS1X_Y0VHxpV35UMJHk_UCIPg/p2p/12D3KooWAp58z5DeiQSVUXdeqgyLjvkcxgph9Pn2xZ9D1yWzHPCV",

          "/ip4/10.5.0.2/udp/4001/quic-v1/webtransport/certhash/uEiDWmsTxXe55Mbwnvd1qrPZAcE5Jtc0tE9WtGXD_NpMERg/certhash/uEiCoik2HBeT5oc9Jib3SQJzNjn9AnznMDpQWcOeKSuEc9A/p2p/12D3KooWQF6Q3i1QkziJQ9mkNNcyFD8GPQz6R6oEvT75wgsVXm4v",
          "/ip4/127.0.0.1/udp/4001/quic-v1/webtransport/certhash/uEiDWmsTxXe55Mbwnvd1qrPZAcE5Jtc0tE9WtGXD_NpMERg/certhash/uEiCoik2HBeT5oc9Jib3SQJzNjn9AnznMDpQWcOeKSuEc9A/p2p/12D3KooWQF6Q3i1QkziJQ9mkNNcyFD8GPQz6R6oEvT75wgsVXm4v",
          "/ip4/97.126.16.119/udp/4001/quic-v1/webtransport/certhash/uEiDWmsTxXe55Mbwnvd1qrPZAcE5Jtc0tE9WtGXD_NpMERg/certhash/uEiCoik2HBeT5oc9Jib3SQJzNjn9AnznMDpQWcOeKSuEc9A/p2p/12D3KooWQF6Q3i1QkziJQ9mkNNcyFD8GPQz6R6oEvT75wgsVXm4v",

          "/ip4/172.16.0.10/udp/26662/quic/webtransport/certhash/uEiCzHFKwct72TeBBh7-LUQ8L9QWwAo0b7d4VvsatjsQlQQ/certhash/uEiBKclz2BT5PNmQ9LIZr0DdhY7MpLLNXz8xLVdzSGyVXbA/p2p/12D3KooWR9jc8uHQ7T1n8Um5kt48usmNZxZftBKKEq9o4MYdFizT",
          "/ip4/18.237.216.248/udp/4002/quic/webtransport/certhash/uEiD_zsX_4c3px3fXGcR7l7Y1uuUVBNrzvDZ3Yo0gG7icvg/certhash/uEiDa3KMjw1j1X7eoyNBLODDh_4TEsKFNKTE7T2Ji-QTE-w/p2p/12D3KooWKasdPzM2iDcBQTHP3YWR8DdgAoBMP4BqXWvxhuCVAYFU",
          "/ip4/34.221.29.193/udp/4001/quic-v1/webtransport/certhash/uEiC13IfwpbpLsAgaV3a-9JR9FDZPxPabgv-UqmAfQuHeVw/certhash/uEiAdK9M5b3NvBMINTaVbfLAjxsTMTY2x-pEQB6lPYQe-Tw/p2p/12D3KooWEKMXiNrBNi6LkNGdT7PxoGuTqFqAiQTosRHftk2vk4k7",

          "/ip4/10.244.0.6/tcp/4001/p2p/12D3KooWDfaWHmKi9XgrDw6e4tgu3noyjm8DmLRuQwyqVszdbcAe",
          "/ip4/10.244.0.6/udp/4001/quic-v1/p2p/12D3KooWDfaWHmKi9XgrDw6e4tgu3noyjm8DmLRuQwyqVszdbcAe",
          "/ip4/10.244.0.6/udp/4001/quic-v1/webtransport/certhash/uEiBbxxmTGYfq5yfJlfEhVqZw3jaXvwHkUwTbCextejV_vQ/certhash/uEiDuSoxQYdkKvPKSp32-8jFemuC8F6vsBTKjVYddm_trmg/p2p/12D3KooWDfaWHmKi9XgrDw6e4tgu3noyjm8DmLRuQwyqVszdbcAe",
          "/ip4/10.244.0.6/udp/4001/quic/p2p/12D3KooWDfaWHmKi9XgrDw6e4tgu3noyjm8DmLRuQwyqVszdbcAe",
          "/ip4/154.53.46.59/tcp/4001/p2p/12D3KooWD6jzDPEFDN8pjozFs2HVzvBfcsQYgzmrAi77rJfk9ghA/p2p-circuit/p2p/12D3KooWDfaWHmKi9XgrDw6e4tgu3noyjm8DmLRuQwyqVszdbcAe",
          "/ip4/154.53.46.59/udp/4001/quic-v1/p2p/12D3KooWD6jzDPEFDN8pjozFs2HVzvBfcsQYgzmrAi77rJfk9ghA/p2p-circuit/p2p/12D3KooWDfaWHmKi9XgrDw6e4tgu3noyjm8DmLRuQwyqVszdbcAe",
          "/ip4/154.53.46.59/udp/4001/quic/p2p/12D3KooWD6jzDPEFDN8pjozFs2HVzvBfcsQYgzmrAi77rJfk9ghA/p2p-circuit/p2p/12D3KooWDfaWHmKi9XgrDw6e4tgu3noyjm8DmLRuQwyqVszdbcAe",
          "/ip4/66.42.107.0/tcp/4001/p2p/12D3KooWNFrxvqzQDrVWfVFfTezfakB3FAJJRw8kKhRNcw8MGUQE/p2p-circuit/p2p/12D3KooWDfaWHmKi9XgrDw6e4tgu3noyjm8DmLRuQwyqVszdbcAe",
          "/ip4/66.42.107.0/udp/4001/quic-v1/p2p/12D3KooWNFrxvqzQDrVWfVFfTezfakB3FAJJRw8kKhRNcw8MGUQE/p2p-circuit/p2p/12D3KooWDfaWHmKi9XgrDw6e4tgu3noyjm8DmLRuQwyqVszdbcAe",
          "/ip4/66.42.107.0/udp/4001/quic/p2p/12D3KooWNFrxvqzQDrVWfVFfTezfakB3FAJJRw8kKhRNcw8MGUQE/p2p-circuit/p2p/12D3KooWDfaWHmKi9XgrDw6e4tgu3noyjm8DmLRuQwyqVszdbcAe",

          "/ip4/10.244.0.7/tcp/4001/p2p/12D3KooWRt8ciG9Bz2BpjKV3416fWcAvRPchGWXt6jNbaoTfJGto",
          "/ip4/10.244.0.7/udp/4001/quic-v1/p2p/12D3KooWRt8ciG9Bz2BpjKV3416fWcAvRPchGWXt6jNbaoTfJGto",
          "/ip4/10.244.0.7/udp/4001/quic-v1/webtransport/certhash/uEiDxtDg_kh_UDtk3-ZP6-vJtTOXWsBsFLbVFzDyDBAkYLw/certhash/uEiCpMr9FUtxtMMNllO-yKksgfK-eHC75Fye9LmkCGPFzLQ/p2p/12D3KooWRt8ciG9Bz2BpjKV3416fWcAvRPchGWXt6jNbaoTfJGto",
          "/ip4/10.244.0.7/udp/4001/quic/p2p/12D3KooWRt8ciG9Bz2BpjKV3416fWcAvRPchGWXt6jNbaoTfJGto",
          "/ip4/155.138.212.178/tcp/4001/p2p/12D3KooWRje7cgvGXUDRe2zwBBrSdFJyT9SAZVqyLAmTAfCqjrcp/p2p-circuit/p2p/12D3KooWRt8ciG9Bz2BpjKV3416fWcAvRPchGWXt6jNbaoTfJGto",
          "/ip4/155.138.212.178/udp/4001/quic-v1/p2p/12D3KooWRje7cgvGXUDRe2zwBBrSdFJyT9SAZVqyLAmTAfCqjrcp/p2p-circuit/p2p/12D3KooWRt8ciG9Bz2BpjKV3416fWcAvRPchGWXt6jNbaoTfJGto",
          "/ip4/155.138.212.178/udp/4001/quic/p2p/12D3KooWRje7cgvGXUDRe2zwBBrSdFJyT9SAZVqyLAmTAfCqjrcp/p2p-circuit/p2p/12D3KooWRt8ciG9Bz2BpjKV3416fWcAvRPchGWXt6jNbaoTfJGto",
          "/ip4/185.239.209.221/tcp/4001/p2p/12D3KooWQN8VkacB3e1521CBUnEukEQRr96Cb7qpvqKK1n5zmZLd/p2p-circuit/p2p/12D3KooWRt8ciG9Bz2BpjKV3416fWcAvRPchGWXt6jNbaoTfJGto",
          "/ip4/185.239.209.221/udp/4001/quic-v1/p2p/12D3KooWQN8VkacB3e1521CBUnEukEQRr96Cb7qpvqKK1n5zmZLd/p2p-circuit/p2p/12D3KooWRt8ciG9Bz2BpjKV3416fWcAvRPchGWXt6jNbaoTfJGto",
          "/ip4/185.239.209.221/udp/4001/quic/p2p/12D3KooWQN8VkacB3e1521CBUnEukEQRr96Cb7qpvqKK1n5zmZLd/p2p-circuit/p2p/12D3KooWRt8ciG9Bz2BpjKV3416fWcAvRPchGWXt6jNbaoTfJGto",

          // "/dns4/node0.preload.ipfs.io/tcp/443/wss/p2p/QmZMxNdpMkewiVZLMRxaNxUeZpDUb34pWjZ1kZvsd16Zic",
          // "/dns4/node1.preload.ipfs.io/tcp/443/wss/p2p/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6",
          // "/dns4/node2.preload.ipfs.io/tcp/443/wss/p2p/QmV7gnbW5VTcJ3oyM2Xk1rdFBJ3kTkvxc87UFGsun29STS",
          // "/dns4/node3.preload.ipfs.io/tcp/443/wss/p2p/QmY7JB6MQXhxHvq7dBDh4HpbH29v4yE9JRadAVpndvzySN",
          // "/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
          // "/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb",
          // "/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp",
          // "/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa",
          // "/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt",
        ],
        timeout: 10000,
      }),
    ],
    nat: {
      enabled: false,
    },
    start: false,
  });

  return libp2pNode;
};

const getFileFromIPFS = async (cidStr: string) => {
  // TODO: use libp2p node to fetch the file
  try {
    const response = await axios.get<object>(ipfsGatewayUrl + cidStr);
    if (response.status === 200) {
      return response.data;
    }
    throw new Error("Error fetching file from IPFS");
  } catch (error) {
    console.log(error);
    return "";
  }

  // if (!libp2pNode?.isStarted()) {
  //   return;
  // }

  // // Convert the CID string to a CID instance
  // const cid = CID.parse(cidStr);

  // const controller = new AbortController();
  // // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // // @ts-ignore
  // const providers = libp2pNode.contentRouting.findProviders(cid, {
  //   maxNumProviders: 5,
  //   signal: controller.signal,
  // });
  // console.log("providers", providers);

  // let baseProvider = null;
  // for await (const provider of providers) {
  //   baseProvider = provider;
  //   console.log(provider.id, provider.multiaddrs);
  //   break;
  // }

  // if (!baseProvider) {
  //   console.error("No providers found for the given CID.");
  //   return;
  // }

  // // Connect to the first provider and fetch the content
  // const stream = await libp2pNode.dialProtocol(baseProvider.id, [
  //   "/ipfs/" + cidStr,
  // ]);
  // console.log("stream", stream);
  // const chunks = [];

  // for await (const chunk of stream) {
  //   chunks.push(chunk);
  // }

  // // Convert the chunks to a single buffer
  // const fileBuffer = Buffer.concat(chunks);

  // console.log(`File content: ${fileBuffer.toString()}`);
};

export { libp2pNode, getFileFromIPFS, createLibp2pNode };
