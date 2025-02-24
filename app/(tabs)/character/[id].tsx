import { useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useFocusEffect } from "@react-navigation/native";

interface Character {
    image: string;
    name: string;
    species: string;
    status: string;
}

export default function CharacterDetail() {
    const { id } = useLocalSearchParams();
    const [character, setCharacter] = useState<Character | null>(null);
    const [loading, setLoading] = useState(true);

    async function fetchCharacter() {
        setLoading(true); // Ativa o loading sempre que a tela for visitada
        try {
            const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
            const data = await response.json();
            setCharacter(data);
        } catch (error) {
            console.error("Erro ao buscar personagem:", error);
        } finally {
            setLoading(false);
        }
    }

    // Recarregar dados toda vez que a tela for visitada
    useFocusEffect(
        useCallback(() => {
            fetchCharacter();
        }, [id])
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#fff" />
            </View>
        );
    }

    if (!character) {
        return (
            <View style={styles.loadingContainer}>
                <ThemedText>Personagem não encontrado.</ThemedText>
            </View>
        );
    }

    return (
        <ThemedView style={styles.container}>
            <Image source={{ uri: character.image }} style={styles.image} />
            <ThemedText type="title">{character.name}</ThemedText>
            <ThemedText>Espécie: {character.species === "Human" ? "Humano" : "Alien"}</ThemedText>
            <ThemedText>Status: {character.status === "Alive" ? "🟢" : character.status === "Dead" ? "🔴" : "🟡"}</ThemedText>
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
    },
    image: {
        width: 200,
        height: 200,
        borderRadius: 100,
        marginBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#151718",
    },
});
