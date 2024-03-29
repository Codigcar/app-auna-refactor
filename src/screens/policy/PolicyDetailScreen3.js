import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Alert,FlatList, Platform, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Divider, Image } from 'react-native-elements';
import { ButtonInitial } from '../../components';
import Constant from '../../utils/constants';
import { css } from '../../utils/css';
import AuthLoadingScreen from '../auth/AuthLoadingScreen';
import PolicyDocumentScreen from './PolicyDocumentScreen';
import DependientesScreen from './DependientesScreen';
import SolicitudesScreen from './SolicitudesScreen';
//NO  "CLINICAS"
//SI  "DEPENDIENTES ASEGURADOS"
import PolicyClinicaScreen from './PolicyClinicaScreen';
import LoadingActivityIndicator from '../../components/LoadingActivityIndicator';


export default function PolicyDetailScreen({ navigation, route }) {
  console.log('[PolicyDetailScreen 3]');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Pólizas',
      headerTitleStyle: css.titleScreen,
      headerTitleAlign: 'center',
      headerBackTitleVisible: false,
      headerRight: () => (
        <ButtonInitial
          navigation={navigation}
          nombre={route.params.userRoot.nombre}
          apellido={route.params.userRoot.apellidoPaterno}
        />
      )
    });
  }, [navigation]);

  useEffect(() => {
    fetchCategoriesClinic()
  }, [])
  

  // fetch Clinica Categories
  const fetchCategoriesClinic = () => {
    setIsLoading(true);
    let uri =
    Constant.URI.PATH +
    Constant.URI.GET_CATEGORIAS +
    '?I_Sistema_IdSistema=' +
    route.params.userRoot.idSistema +
    '&I_Riesgo_IdRiesgo=' +
    route.params.policy.idRiesgo +
    '&I_PlanAsegurado_idPlanAsegurado=' +
    (route.params.policy.idPlanAsegurado == null
      ? 0
      : route.params.policy.idPlanAsegurado) +
    '&I_UsuarioExterno_IdUsuarioExterno=' +
    route.params.userRoot.idUsuarioExterno;

    fetch(uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: route.params.userRoot.Token,
      },
    })
      .then(response => response.json())
      .then(response => {
        if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
          Alert.alert('', response.RespuestaMensaje);
          setIsLoading(false);
        } else {
          setCategories(response.Result);
          setIsLoading(false);
        }
      })
      .catch(error => console.error(error));
  }

  if(isLoading){
    return <LoadingActivityIndicator />
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      initialParams={{ userRoot: route.params.userRoot, policy: route.params.policy, riskGroup: route.params.riskGroup }}
      tabBarOptions={{
        showIcon: true,
        activeTintColor: css.colors.primary,
        inactiveTintColor: css.colors.opaque,
        labelStyle: { fontSize: 12 },
        indicatorStyle: { backgroundColor: '#FF0000' }
      }}
      style={{
        borderTopColor: "#FF0000",
        borderTopWidth: 2
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ userRoot: route.params.userRoot, policy: route.params.policy, riskGroup: route.params.riskGroup }}
        options={{
          tabBarLabel: 'Detalle',
          tabBarIcon: ({ color }) => (
            <Image
              style={{ width: 26, height: 26 }}
              source={Constant.GLOBAL.IMAGES.POLICY_DETAIL}>
            </Image>
          ),
        }}
      /> 
       <Tab.Screen
        name="DependientesScreen"
        component={DependientesScreen}
        initialParams={{ userRoot: route.params.userRoot, policy: route.params.policy }}
        options={{
          tabBarLabel: ({ color }) => (
            <Text 
            numberOfLines={1}
            adjustsFontSizeToFit 
            style={{ color:css.colors.opaque, fontSize:12.5, maxWidth: 87, textAlignVertical:"center", textAlign:"center"}} >
            ASEGURADOS
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Image
              style={{ width: 26, height: 26, marginTop:-3 }}
              source={Constant.GLOBAL.IMAGES.DEPENDIENTES_AVATAR}>
            </Image>
          ),
        }}
      />
      <Tab.Screen
        name="PolicyDocumentScreen"
        component={PolicyDocumentScreen}
        initialParams={{ userRoot: route.params.userRoot, policy: route.params.policy }}
        options={{
          tabBarLabel: ({ color }) => (
            <Text 
            numberOfLines={1}
            adjustsFontSizeToFit 
            style={{ color:css.colors.opaque, fontSize:12, maxWidth: 87, textAlignVertical:"center", textAlign:"center",}} >
            DOCUMENTOS
            </Text>
          ),
          tabBarIcon: ({ color }) => (
            <Image
              style={{ width: 26, height: 26 }}
              source={Constant.GLOBAL.IMAGES.POLICY_DOCUMENTS}>
            </Image>
          ),
        }}
      />
       {categories.length !== 0 &&
        <Tab.Screen
        name="PolicyClinicaScreen"
        component={PolicyClinicaScreen}
        initialParams={{
          userRoot: route.params.userRoot,
          policy: route.params.policy,
          riskGroup: route.params.riskGroup,
        }}
        options={{
          tabBarLabel: ({color}) => (
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              style={{
                color: css.colors.opaque,
                fontSize: 10,
                textAlignVertical: 'center',
                textAlign: 'center',
              }}>
              CLÍNICAS
            </Text>
          ),
          tabBarIcon: ({color}) => (
            <Image
              style={{width: 26, height: 26}}
              source={Constant.GLOBAL.IMAGES.POLICY_CLINICA}></Image>
          ),
        }}
      />}
    </Tab.Navigator>
  );
}
 
function HomeScreen({ navigation, route }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (items.length === 0) {
      fetch(Constant.URI.PATH + Constant.URI.POLIZA_DETALLE_OBTENER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': route.params.userRoot.Token
        },
        body: JSON.stringify({
          "I_Sistema_IdSistema": route.params.userRoot.idSistema,
          "I_Poliza_IdPoliza": route.params.policy.idPoliza,
          "I_UsuarioExterno_IdUsuarioExterno": route.params.userRoot.idUsuarioExterno,
        })
      })
        .then((response) => response.json())
        .then((response) => {

          if (response.CodigoMensaje < 100 || response.CodigoMensaje > 199) {
            Alert.alert('Error', response.mensaje);
          } else {
            setItems(response);
          }
        })
        .catch((error) => console.error(error));
    }
  })


  if (items.length === 0) {
    return (
      <AuthLoadingScreen />
    );
  }
  return (
    <SafeAreaView style={css.screen}>
      <FlatList
        data={items}
        keyExtractor={(item, index) => String.valueOf(item.idPoliza) + `${index}`}
        renderItem={({ item }) =>
          <ScrollView>
            <View style={styles.container}>
              <View>
                <View style={StyleSheet.flatten([styles.viewSlot, { marginBottom: 2 }])}>
                  <Text style={styles.labelHeaderText}>N° de Póliza</Text>
                  <Text style={StyleSheet.flatten([styles.outputText, { fontWeight: "bold" }])}>{item.numeroPoliza}</Text>
                </View>
                <View style={StyleSheet.flatten([styles.viewSlot, { marginTop: 2 }])}>
                  <Text style={styles.outputText}>Aseguradora</Text>
                  <Text style={StyleSheet.flatten([styles.labelHeaderText, { color: "#FF0000" }])}>{item.nombreCortoAseguradora}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.viewSlot}>
                <Text style={styles.labelText}>Riesgo</Text>
                <Text style={styles.outputText}>{item.nombreRiesgo}</Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.viewSlot} display= {(item.mostrarPlanAsegurado == 1) ? "flex" : "none"}>
                  <Text style={styles.labelText}>Plan:</Text>
                  <Text style={styles.outputText}>{item.nombrePlanAsegurado}</Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.viewSlot}>
                <Text style={styles.labelText}>Unidad de negocio</Text>
                <Text style={styles.outputText}>{item.nombreUnidadNegocio}</Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.viewSlot}>
                <Text style={styles.labelText}>Vigencia</Text>
                <Text style={styles.outputText}>{item.VigenciaPoliza}</Text>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.viewSlot}>
                <Text style={styles.labelText}>Ejecutivo</Text>
                <Text style={styles.outputText}>{item.nombresFuncionarioInterno}</Text>
              </View>
            </View>
          </ScrollView>

        }
      />
    </SafeAreaView>
  );

}

const Tab = createMaterialTopTabNavigator();

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    paddingTop: 5,
    marginBottom: 0,
    borderColor: css.colors.opaque,
    ...Platform.select({
      android: {
        elevation: 1,
      },
      default: {
        shadowColor: 'rgba(0,0,0, .2)',
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 1,
      },
    }),
  },
  labelHeaderText: {
    fontSize: 14,
    fontWeight: "bold"
  },
  labelText: {
    fontSize: 14,
  },
  outputText: {
    fontSize: 14,
    color: css.colors.opaque,
  },
  viewSlot: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 5,
    marginBottom: 12,
    marginTop: 12,
    padding: 5
  },
  divider: {
    backgroundColor: css.colors.opaque,
    padding: 0.3
  },


});