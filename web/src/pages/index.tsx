import Image from "next/image";
import { api } from "../lib/axios";
import appPreviewImg from "../assets/app_mobile_preview.png";
import logoImg from "../assets/logo.svg";
import avatarsExampleImg from "../assets/app_users_example.png";
import iconCheckmarkImg from "../assets/icon_checkmark.svg";

interface HomeProps {
	poolCount: number;
	guessCount: number;
	userCount: number;
}

export default function Home(props: HomeProps) {
	return (
		<div className="max-w-5xl h-screen mx-auto grid grid-cols-2 items-center gap-28">
			<main>
				<Image src={logoImg} alt="NLW Copa" />
				<h1 className="mt-14 text-white text-5xl font-bold leading-tight">
					Crie seu próprio bolão da copa e compartilhe entre amigos!
				</h1>
				<div className="mt-10 gap-2 flex items-center">
					<Image
						src={avatarsExampleImg}
						alt="Users avatars examples"
					/>
					<strong className="text-gray-100 text-xl">
						<span className="text-green-500">
							+{props.userCount}
						</span>{" "}
						pessoas já estão usando
					</strong>
				</div>
				<form className="mt-10 flex gap-2">
					<input
						className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm "
						type="text"
						required
						placeholder="Qual nome do seu bolão?"
					/>
					<button
						className="px-6 py-4 rounded bg-yellow-500 text-gray-900 text-sm uppercase font-bold hover:bg-yellow-700"
						type="submit"
					>
						Criar meu bolão
					</button>
				</form>
				<p className="mt-4 text-sm  text-gray-300 leading-relaxed max-w-sm">
					Após criar seu bolão, você receberá um código único que
					poderá usar para convidar outras pessoas 🚀
				</p>
				<div className="mt-10 pt-10 border-t border-gray-600 text-gray-100 flex item-center justify-between">
					<div className="flex items-center gap-6">
						<Image src={iconCheckmarkImg} alt="Green checkmark" />
						<div className="flex flex-col">
							<span className="font-bold text-2xl">
								+{props.poolCount}
							</span>
							<span>Bolões criados</span>
						</div>
					</div>

					<div className="w-px h-14  bg-gray-600" />

					<div className="flex items-center gap-6">
						<Image src={iconCheckmarkImg} alt="Green checkmark" />
						<div className="flex flex-col">
							<span className="font-bold text-2xl">
								+{props.guessCount}
							</span>
							<span>Palpites enviados</span>
						</div>
					</div>
				</div>
			</main>
			<Image
				src={appPreviewImg}
				alt="Two smartphone showing a preview of the mobile app World Cup Fantasy League"
				quality={100}
			/>
		</div>
	);
}

export const getServerSideProps = async () => {
	const [poolCountResponse, guessCountResponse, userCountResponse] =
		await Promise.all([
			api.get("http://localhost:3333/pools/count"),
			api.get("http://localhost:3333/guesses/count"),
			api.get("http://localhost:3333/users/count"),
		]);

	return {
		props: {
			poolCount: poolCountResponse.data.count,
			guessCount: guessCountResponse.data.count,
			userCount: userCountResponse.data.count,
		},
	};
};
