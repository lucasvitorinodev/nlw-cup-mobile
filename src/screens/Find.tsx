import { Header } from "../components/Header";
import { Heading, useToast, VStack } from "native-base";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { useState } from "react";
import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const { navigate } = useNavigation();

  const toast = useToast();

  const handleJoinPool = async () => {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        return toast.show({
          title: "Informe o código do bolão",
          placement: "top",
          bgColor: "red.500",
        });
      }

      await api.post("/pools/join", { code });

      toast.show({
        title: "Você entrou no bolão com sucesso!",
        placement: "top",
        bgColor: "green.500",
      });

      navigate("pools");
    } catch (err) {
      console.log("-> err", err);
      setIsLoading(false);

      if (err.response?.data?.message === "Pool not found") {
        toast.show({
          title: "Bolão não encontrado!",
          placement: "top",
          bgColor: "red.500",
        });
      }

      if (err.response?.data?.message === "You already joined this pool") {
        toast.show({
          title: "Você já está nesse bolão!",
          placement: "top",
          bgColor: "red.500",
        });
      }

      toast.show({
        title: "Não foi possível encontrar o bolão!",
        placement: "top",
        bgColor: "red.500",
      });
    }
  };

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          color="white"
          fontFamily="heading"
          fontSize="xl"
          textAlign="center"
          mb={8}
        >
          Encontre um bolão através de {"\n"}seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual o código bolão?"
          autoCapitalize="characters"
          value={code}
          onChangeText={setCode}
        />

        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
