import clsx from "clsx";
import { GetServerSideProps } from "next";
import {
	Dispatch,
	ReactNode,
	SetStateAction,
	useEffect,
	useRef,
	useState,
} from "react";
import { io } from "socket.io-client";
import Container from "../components/ui/Container";
import Searchbox from "../components/ui/Searchbox";
import TextLink from "../components/ui/TextLink";
import { PageProps } from "../types";
import { moderatorRoute } from "../util/redirects";
import { withSession } from "../util/session";

const States = {
	READY: "bg-dank-200",
	INITIALISING: "bg-dank-200 animate-pulse",
	UNINITIALIZED: "bg-[#8f8f8f]",
	COLD: "bg-[#8f8f8f]",
	GUILD_CREATE: "bg-[#00CC99] animate-pulse",
	RESUMING: "bg-[#FEDC56] animate-pulse",
	DISCONNECTED: "bg-[#C80032]",
	CONNECTED: "bg-[#0080FF]",
	CONNECTING: "bg-[#0080FF] animate-pulse",
};

interface ShardData {
	id: number;
	state: keyof typeof States;
}

interface ShardProps {
	id: ShardData["id"];
	state: ShardData["state"];
	fullscreen: boolean;
}

function Shard({ id, state, fullscreen }: ShardProps) {
	return (
		<div
			className={clsx(
				"flex justify-center items-center",
				"rounded-md",
				"transition-colors",
				States[state],
				fullscreen ? "m-0.5 h-8 w-8 text-xs" : "m-2 h-12 w-12"
			)}
		>
			{id}
		</div>
	);
}

interface LegendProps {
	color: string;
	children: ReactNode;
	setFilter: Dispatch<SetStateAction<Array<keyof typeof States>>>;
	filter: Array<keyof typeof States>;
	states: Array<keyof typeof States>;
}

function Legend({ color, children, setFilter, filter, states }: LegendProps) {
	const current = JSON.stringify(states) === JSON.stringify(filter);

	return (
		<div
			className={clsx(
				"flex space-x-2 items-center cursor-pointer select-none",
				current && "underline"
			)}
			onClick={() => setFilter(current ? [] : states)}
		>
			<div
				className="h-5 w-5 rounded-md"
				style={{ backgroundColor: color }}
			></div>
			<div>{children}</div>
		</div>
	);
}

export default function Status({ user }: PageProps) {
	const [shards, setShards] = useState<ShardData[]>([]);
	const [shardUpdate, setShardUpdate] = useState<ShardData>();
	const [filter, setFilter] = useState<Array<keyof typeof States>>([]);
	const [search, setSearch] = useState("");
	const [id, setId] = useState(-1);
	const [fullscreen, setFullscreen] = useState(false);
	const shardContainer = useRef<HTMLDivElement>(null);

	const handleFullscreen = (event: KeyboardEvent) => {
		const key = event?.key;

		if (key == "f" && !fullscreen) {
			shardContainer.current!.requestFullscreen();
			setFullscreen(true);
		}
	};

	useEffect(() => {
		fetch(`https://dankmemer.party/internal/status/shards`)
			.then((r) => r.json())
			.then((data) => {
				setShards(data);
			});
	}, []);

	useEffect(() => {
		const client = io("https://dankmemer.party", {
			path: "/internal/status/socket.io",
		});

		client.on("shardStatus", (data) => {
			setShardUpdate(data);
		});
	}, []);

	useEffect(() => {
		window.addEventListener("keydown", handleFullscreen, false);

		return () => {
			window.removeEventListener("keydown", handleFullscreen);
		};
	}, []);

	useEffect(() => {
		if (shards.length > 0 && shardUpdate) {
			const copy = [...shards];
			const shard = copy.find((s) => s.id == shardUpdate.id);

			if (shard && shardUpdate.state != shard.state) {
				shard.state = shardUpdate.state;
				setShards(copy);
			}
		}
	}, [shardUpdate]);

	useEffect(() => {
		if (Number(search)) {
			setId(
				parseInt(
					(
						(BigInt(Number(search)) >> BigInt(22)) %
						BigInt(896 * 4)
					).toString()
				)
			);
		} else {
			setId(-1);
		}
	}, [search]);

	return (
		<Container title="Status" user={user}>
			<div className="relative my-16">
				<div className="flex flex-col space-y-6">
					<div>
						<div className="text-3xl font-bold font-montserrat text-dark-500 dark:text-white">
							Status
						</div>
						<div>
							This page will{" "}
							<span className="text-dank-100">automatically</span>{" "}
							update once a status changes.
						</div>
					</div>

					<div>
						<div className="font-bold">This shard is:</div>
						<div className="flex space-x-4">
							<Legend
								color="#14763d"
								setFilter={setFilter}
								filter={filter}
								states={["READY"]}
							>
								operational
							</Legend>
							<Legend
								color="#0080FF"
								setFilter={setFilter}
								filter={filter}
								states={[
									"CONNECTED",
									"CONNECTING",
									"INITIALISING",
								]}
							>
								connecting
							</Legend>
							<Legend
								color="#FEDC56"
								setFilter={setFilter}
								filter={filter}
								states={["RESUMING"]}
							>
								resuming
							</Legend>
							<Legend
								color="#8f8f8f"
								setFilter={setFilter}
								filter={filter}
								states={[
									"UNINITIALIZED",
									"GUILD_CREATE",
									"COLD",
								]}
							>
								uninitialized
							</Legend>
							<Legend
								color="#C80032"
								setFilter={setFilter}
								filter={filter}
								states={["DISCONNECTED"]}
							>
								disconnected
							</Legend>
						</div>
					</div>
					<div>
						<Searchbox
							placeholder="Server ID"
							setSearch={setSearch}
						/>
						<div className="text-xs">
							<TextLink
								href="https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-"
								blank
							>
								How do I find my server ID?
							</TextLink>
						</div>
					</div>
					<div
						className="flex flex-wrap overflow-y-auto"
						ref={shardContainer}
					>
						{shards
							.filter((s) =>
								filter.length
									? filter.includes(s.state)
									: id == -1
									? true
									: s.id == id
							)
							.map((shard) => (
								<Shard
									id={shard.id}
									state={shard.state}
									fullscreen={fullscreen}
								/>
							))}
					</div>
				</div>
			</div>
		</Container>
	);
}

export const getServerSideProps: GetServerSideProps =
	withSession(moderatorRoute);
