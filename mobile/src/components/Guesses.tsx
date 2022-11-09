import { useEffect, useState } from "react";
import { useToast, FlatList } from "native-base";
import { api } from "../services/api";

import { Game, GameProps } from "../components/Game";
import { Loading } from "../components/Loading";
import { EmptyMyPollList } from "../components/EmptyMyPollList";

interface Props {
	pollId: string;
	code: string;
}

export function Guesses({ pollId: pollId, code }: Props) {
	const toast = useToast();

	const [isLoading, setIsLoading] = useState(true);
	const [games, setGames] = useState<GameProps[]>([]);
	const [firstTeamScore, setFirstTeamScore] = useState("");
	const [secondTeamScore, setSecondTeamScore] = useState("");

	async function fetchGames() {
		try {
			setIsLoading(true);

			const gamesResponse = await api.get(`/polls/${pollId}/games`);
			setGames(gamesResponse.data.games);
		} catch (error) {
			console.log(error);
			toast.show({
				title: "Não foi possível carregar os jogos.",
				placement: "top",
				bgColor: "red.500",
			});
		} finally {
			setIsLoading(false);
		}
	}

	async function handleGuessConfirm(gameId: string) {
		try {
			setIsLoading(true);

			if (!firstTeamScore.trim() || !secondTeamScore.trim()) {
				return toast.show({
					title: "Informe o placar do seu palpite.",
					placement: "top",
					bgColor: "red.500",
				});
			}

			await api.post(`/polls/${pollId}/games/${gameId}/guess`, {
				firstTeamScore: Number(firstTeamScore),
				secondTeamScore: Number(secondTeamScore),
			});

			toast.show({
				title: "Palpite realizado com sucesso.",
				placement: "top",
				bgColor: "green.500",
			});

			fetchGames();
		} catch (error) {
			console.log(error);
			toast.show({
				title: "Não foi possível confirmar seu palpite.",
				placement: "top",
				bgColor: "red.500",
			});
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchGames();
	}, [pollId]);

	if (isLoading) return <Loading />;

	return (
		<FlatList
			data={games}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<Game
					data={item}
					setFirstTeamScore={setFirstTeamScore}
					setSecondTeamScore={setSecondTeamScore}
					onGuessConfirm={() => handleGuessConfirm(item.id)}
				/>
			)}
			_contentContainerStyle={{ pb: 10 }}
			ListEmptyComponent={() => <EmptyMyPollList code={code} />}
		/>
	);
}
