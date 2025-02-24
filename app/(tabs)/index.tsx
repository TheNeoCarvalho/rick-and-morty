import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, FlatList, ActivityIndicator, Pressable } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Link, router } from 'expo-router';

interface Character {
  id: number;
  image: string;
  name: string;
  species: string;
  status: string;
}

export default function HomeScreen() {
  const [data, setData] = useState<Character[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchData(newPage: number) {
    if (isLoading) return; // Evita chamadas duplicadas

    setIsLoading(true);
    try {
      const response = await fetch(`https://rickandmortyapi.com/api/character?page=${newPage}`);
      const json = await response.json();
      setData((prevData) => [...prevData, ...json.results]); // Adiciona os novos personagens à lista
      setPage(newPage);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData(1);
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#fff', dark: '#000' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Rick and Morty</ThemedText>
      </ThemedView>

      <FlatList
        data={data}
        nestedScrollEnabled={true}
        renderItem={({ item }) => (
          <Pressable onPress={() => {
            router.push(`/character/${item.id}`)
          }}>
            <ThemedView style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
              <ThemedView style={{ backgroundColor: '#999' }}>
                <ThemedText style={styles.name}>{item.name}</ThemedText>
                <ThemedText>Espécie: {item.species === 'Human' ? 'Humano' : 'Alien'}</ThemedText>
                <ThemedText>Status: {item.status === 'Alive' ? '🟢' : item.status === 'Dead' ? '🔴' : '🟡'}</ThemedText>
              </ThemedView>
            </ThemedView>
          </Pressable>
        )}
        keyExtractor={(item, index) => item.name + "-" + index}
        onEndReached={() => fetchData(page + 1)}
        onEndReachedThreshold={0.2} // Define quando a próxima página deve ser carregada (20% antes do final)
        ListFooterComponent={isLoading ? <ActivityIndicator size="large" color="#000" /> : null}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    backgroundColor: '#999',
    borderRadius: 8,
    marginBottom: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  reactLogo: {
    width: '100%',
  },
});
