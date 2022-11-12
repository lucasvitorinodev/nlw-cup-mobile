import { HStack, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Loading } from "../components/Loading";
import { PoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Share } from "react-native";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<"guesses" | "ranking">(
    "guesses"
  );
  const [poolDetails, setPoolDetails] = useState<PoolCardProps>(
    {} as PoolCardProps
  );
  const route = useRoute();
  const toast = useToast();

  const { id } = route.params as RouteParams;

  const fetchPoolDetails = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/pools/" + id);
      setPoolDetails(response.data);
    } catch (err) {
      console.log("-> err", err);

      toast.show({
        title: "Não foi possível carregar os detalhes do bolao",
        placement: "top",
        bgColor: "green.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeShare = async () => {
    await Share.share({
      message: poolDetails.code,
    });
  };

  useEffect(() => {
    fetchPoolDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header
        title={poolDetails.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {poolDetails._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={poolDetails} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={8}>
            <Option
              title="Seus palpites"
              isSelected={selectedOption === "guesses"}
              onPress={() => setSelectedOption("guesses")}
            />
            <Option
              title="Ranking do grupo"
              isSelected={selectedOption === "ranking"}
              onPress={() => setSelectedOption("ranking")}
            />
          </HStack>

          <Guesses poolId={poolDetails.id} code={poolDetails.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={poolDetails.code} />
      )}
    </VStack>
  );
}
