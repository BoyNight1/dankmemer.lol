import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "../types";
import Dropdown from "./ui/Dropdown";

interface Props {
	user?: User;
}

export default function Navbar({ user }: Props) {
	const [hamburger, setHamburger] = useState(false);

	useEffect(() => {
		document.documentElement.style.overflow = hamburger ? "hidden" : "auto";
	}, [hamburger]);

	useEffect(() => {
		window.addEventListener("resize", () => setHamburger(false));
	}, []);

	return (
		<>
			<div className="flex justify-center items-center text-lg">
				<nav className="max-w-7xl drop-shadow-xl dark:drop-shadow-none bg-light-200 dark:bg-dark-200 rounded-md flex justify-between p-4 mt-0 lg:mt-5 w-full lg:w-11/12">
					<div className="flex items-center">
						<Link href="/">
							<img
								className="cursor-pointer"
								src={"/img/memer.png"}
								alt="Logo"
								width="42"
							/>
						</Link>
						<ul className="ml-5 space-x-4 hidden lg:flex">
							<li className="inline-block text-gray-800 dark:text-light-200 hover:text-dank-300 dark:hover:text-dank-100">
								<Link href="/commands">Commands</Link>
							</li>
							<li className="inline-block text-gray-800 dark:text-light-200 hover:text-dank-300 dark:hover:text-dank-100">
								<Link href="/faq">FAQ</Link>
							</li>
							<li className="inline-block text-gray-800 dark:text-light-200 hover:text-dank-300 dark:hover:text-dank-100">
								<Link href="/blogs">Blog</Link>
							</li>
							<li className="inline-block text-gray-800 dark:text-light-200 hover:text-dank-300 dark:hover:text-dank-100">
								<Link href="/items">Items</Link>
							</li>
							<li className="inline-block text-gray-800 dark:text-light-200 hover:text-dank-300 dark:hover:text-dank-100">
								<Link href="/feedback">Feedback</Link>
							</li>
						</ul>
						<div className="ml-4 text-xl font-montserrat font-bold inline-block lg:hidden">
							Dank Memer
						</div>
					</div>

					<div className="items-center relative hidden lg:flex">
						<Link href="https://discord.gg/meme">
							<a
								className="inline-block text-gray-800 dark:text-light-200 hover:text-dank-300 dark:hover:text-dank-100"
								rel="noreferrer noopener"
							>
								Support
							</a>
						</Link>
						{!user && (
							<Link href="/api/auth/login">
								<a
									className="inline-block text-dank-300 pl-4"
									rel="noreferrer noopener"
								>
									Login
								</a>
							</Link>
						)}
						{user && (
							<div className="pl-4 h-full">
								<Dropdown
									content={
										<div className="flex items-center space-x-2">
											<img
												className="w-8 rounded-full bg-light-200 dark:bg-dark-100"
												src={user.avatar}
											/>
											<div className="text-dark-400 dark:text-white">
												{user.username}
											</div>
											<span className="material-icons text-dark-100 dark:text-white">
												expand_more
											</span>
										</div>
									}
									variant="big"
								>
									<ul className="rounded-md bg-light-500 dark:bg-dark-100 mt-2 py-2 text-sm text-dark-100 dark:text-white">
										{(user.isModerator || user.isAdmin) && (
											<Link href="/control">
												<li className="hover:bg-light-200 dark:hover:bg-dark-200 w-full px-4 py-1 transition duration-75 ease-in-out">
													Control panel
												</li>
											</Link>
										)}
										<Link href="/appeals">
											<li className="hover:bg-light-200 dark:hover:bg-dark-200 w-full px-4 py-1 transition duration-75 ease-in-out">
												Appeal a ban
											</li>
										</Link>
										<Link href="/reports">
											<li className="hover:bg-light-200 dark:hover:bg-dark-200 w-full px-4 py-1 transition duration-75 ease-in-out">
												Report a user
											</li>
										</Link>
										<Link href="/api/auth/logout">
											<li className="text-red-400 hover:bg-light-200 dark:hover:bg-dark-200 w-full px-4 py-1 transition duration-75 ease-in-out">
												Logout
											</li>
										</Link>
									</ul>
								</Dropdown>
							</div>
						)}
					</div>
					<div
						className="items-center relative flex lg:hidden cursor-pointer select-none"
						onClick={() => setHamburger(!hamburger)}
					>
						<span className="material-icons">menu</span>
					</div>
				</nav>
				{hamburger && (
					<ul className="absolute flex flex-col bg-light-200 box-border w-screen h-screen z-50 top-[105px]">
						<Link href="/commands">
							<li className="hover:text-light-600 p-4 border-b-2 border-light-100">
								Commands
							</li>
						</Link>
						<Link href="/faq">
							<li className="hover:text-light-600 p-4 border-b-2 border-light-100">
								FAQ
							</li>
						</Link>
						<Link href="/blogs">
							<li className="hover:text-light-600 p-4 border-b-2 border-light-100">
								Blog
							</li>
						</Link>
						<Link href="/items">
							<li className="hover:text-light-600 p-4 border-b-2 border-light-100">
								Items
							</li>
						</Link>
						<Link href="/feedback">
							<li className="hover:text-light-600 p-4 border-b-2 border-light-100">
								Feedback
							</li>
						</Link>
						<Link href="/appeals">
							<li className="hover:text-light-600 p-4 border-b-2 border-light-100">
								Appeal a ban
							</li>
						</Link>
						<Link href="/reports">
							<li className="hover:text-light-600 p-4 border-b-2 border-light-100">
								Report a user
							</li>
						</Link>
						{(user?.isModerator || user?.isAdmin) && (
							<Link href="/control">
								<li className="hover:text-light-600 p-4 border-b-2 border-light-100">
									Control panel
								</li>
							</Link>
						)}
						{user ? (
							<Link href="/reports">
								<li className="text-red-400 hover:text-red-500 p-4 border-b-2 border-light-100">
									Logout
								</li>
							</Link>
						) : (
							<Link href="/api/auth/logout">
								<li className="hover:text-light-600 p-4 border-b-2 border-light-100">
									Login
								</li>
							</Link>
						)}
					</ul>
				)}
			</div>
		</>
	);
}
