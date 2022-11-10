import { Icon, useToast, VStack, FlatList } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { PoolCard, PoolCardProps } from "../components/PoolCard";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { Loading } from "../components/Loading";

export function Pools() {
  const { navigate } = useNavigation();
  const toast = useToast();

  const [pools, setPools] = useState<PoolCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchPools();
  }, []);

  const fetchPools = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/pools");
      setPools(response.data);
    } catch (err) {
      console.log("-> err", err);

      toast.show({
        title: "Não foi possível carregar os bolões",
        placement: "top",
        bgColor: "green.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack
        mt={6}
        mx={5}
        borderBottomColor="gray.600"
        borderBottomWidth={1}
        pb={4}
        mb={4}
      >
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          leftIcon={
            <Icon as={Octicons} name="search" color="black" size="md" />
          }
          onPress={() => navigate("find")}
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={pools}
          keyExtractor={(item) => item.code}
          renderItem={({ item }) => <PoolCard data={item} />}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      )}

      <VStack></VStack>
    </VStack>
  );
}
