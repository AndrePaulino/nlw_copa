import { useState } from "react";
import { Heading, Text, VStack, useToast } from "native-base";
import Logo from "../assets/logo.svg";
import { api } from "../services/api";

import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function New() {
	const [title, setTitle] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const toast = useToast();

	async function handlePollCreate() {
		if (!title.trim()) {
			return toast.show({
				title: "Informe um nome para seu bolão.",
				placement: "top",
				bgColor: "red.500",
			});
		}

		try {
			setIsLoading(true);
			await api.post("/polls", { title });

			toast.show({
				title: "Não foi possível criar o bolão.",
				placement: "top",
				bgColor: "green.500",
			});
			setTitle("");
		} catch (error) {
			console.log(error);
			toast.show({
				title: "Não foi possível criar o bolão.",
				placement: "top",
				bgColor: "red.500",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<VStack flex={1} bgColor={"gray.900"}>
			<Header title={"Criar novo bolão"} />
			<VStack mt={8} mx={5} alignItems={"center"}>
				<Logo width={212} height={40} />
				<Heading
					fontFamily={"heading"}
					color={"white"}
					fontSize={"xl"}
					textAlign={"center"}
					my={8}
				>
					Crie seu próprio bolão da copa e compartilhe entre amigos!
				</Heading>

				<Input
					mb={4}
					placeholder={"Qual nome do seu bolão?"}
					onChangeText={setTitle}
					value={title}
				/>
				<Button
					title={"Criar meu bolão"}
					onPress={handlePollCreate}
					isLoading={isLoading}
				/>
				<Text
					color={"gray.200"}
					fontSize={"sm"}
					textAlign={"center"}
					px={10}
					mt={6}
				>
					Após criar seu bolão, você receberá um código único que
					poderá usar para convidar outras pessoas.
				</Text>
			</VStack>
		</VStack>
	);
}
