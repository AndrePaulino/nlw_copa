import { VStack, Icon, useToast, FlatList } from "native-base";
import { useState, useCallback } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { EmptyPollList } from "../components/EmptyPollList";
import { PollCard, PollCardProps } from "../components/PollCard";

export function Polls() {
	const { navigate } = useNavigation();
	const toast = useToast();

	const [isLoading, setIsLoading] = useState(true);
	const [polls, setPolls] = useState<PollCardProps[]>([]);

	async function fetchPolls() {
		try {
			setIsLoading(true);
			const pollsResponse = await api.get("/polls");
			setPolls(pollsResponse.data.polls);
		} catch (error) {
			console.log(error);
			toast.show({
				title: "Não foi possível carregar os bolões.",
				placement: "top",
				bgColor: "red.500",
			});
		} finally {
			setIsLoading(false);
		}
	}

	useFocusEffect(
		useCallback(() => {
			fetchPolls();
		}, [])
	);

	return (
		<VStack flex={1} bgColor={"gray.900"}>
			<Header title={"Meus bolões"} />

			<VStack
				mt={6}
				mx={5}
				borderBottomWidth={1}
				borderBottomColor={"gray.600"}
				pb={4}
				mb={4}
			>
				<Button
					title={"BUSCAR BOLÃO POR CÓDIGO"}
					onPress={() => navigate("find")}
					leftIcon={
						<Icon
							as={FontAwesome5}
							name={"search"}
							color="black"
							size={"md"}
						/>
					}
				/>
			</VStack>

			{isLoading ? (
				<Loading />
			) : (
				<FlatList
					data={polls}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => <PollCard data={item} />}
					ListEmptyComponent={() => <EmptyPollList />}
					px={5}
					showsVerticalScrollIndicator={false}
					_contentContainerStyle={{ pb: 10 }}
				/>
			)}
		</VStack>
	);
}
