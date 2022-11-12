import { FlatList, useToast } from "native-base";
import { useEffect, useState } from "react";
import { GameProps, Game } from "./Game";
import { api } from "../services/api";
import { Loading } from "./Loading";
import { EmptyMyPoolList } from "./EmptyMyPoolList";

interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [games, setGames] = useState<GameProps[]>([]);
  const [firstTeamPoints, setFirstTeamPoints] = useState("");
  const [secondTeamPoints, setSecondTeamPoints] = useState("");

  const toast = useToast();

  useEffect(() => {
    fetchGames();
  }, [poolId]);

  const fetchGames = async () => {
    try {
      setIsLoading(true);

      const response = await api.get("/pools/" + poolId + "/games");
      setGames(response.data.games);
    } catch (err) {
      console.log("-> err", err);

      toast.show({
        title: "Não foi possível carregar os dados dos jogos.",
        placement: "top",
        bgColor: "green.500",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuessConfirm = async (gameId: string) => {
    try {
      if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
        toast.show({
          title: "Informe o placar do palpite.",
          placement: "top",
          bgColor: "red.500",
        });
      }

      console.log(
        "-> url",
        "/pools/" + poolId + "/games/" + gameId + "/guesses"
      );
      await api.post("/pools/" + poolId + "/games/" + gameId + "/guesses", {
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints),
      });

      toast.show({
        title: "Palpite realizado com sucesso.",
        placement: "top",
        bgColor: "green.500",
      });

      fetchGames();
    } catch (err) {
      console.log("-> err", err);

      toast.show({
        title: "Não foi possível enviar o palpite.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <FlatList
      data={games}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Game
          data={item}
          onGuessConfirm={() => handleGuessConfirm(item.id)}
          setFirstTeamPoints={setFirstTeamPoints}
          setSecondTeamPoints={setSecondTeamPoints}
        />
      )}
      _contentContainerStyle={{ pb: 10 }}
      ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
    />
  );
}
