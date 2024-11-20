import * as Location from 'expo-location';

export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status !== 'granted') {
      throw new Error('Permissão de localização negada');
    }

    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return { latitude: coords.latitude, longitude: coords.longitude };
  } catch (error) {
    console.error('Erro ao obter localização atual:', error);
    throw new Error('Não foi possível obter a localização atual.');
  }
};
