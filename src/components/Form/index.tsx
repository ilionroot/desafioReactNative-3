import { useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import * as Print from "expo-print";
import PDFReader from "rn-pdf-reader-js";
import { AntDesign } from "@expo/vector-icons";
import * as Sharing from "expo-sharing";

import states from "../../../states.json";

import styles from "./styles";

type pdfType = {
  base64: string;
  uri: string;
};

const pdfStyle: string = `
  .title {
    color: white;
    padding: 2rem;
    background-color: black;
  }

  #signatureTitle {
    font-size: 1.75rem;
  }

  .signature {
    text-decoration: underline;
    font-weight: bold;
  }

  .signatureContainer {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  #confirmation {
    font-size: 1.5rem;
  }

  #mainText {
    line-height: 1.75rem;
    font-size: 1.25rem;
  }

  #dateText {
    font-size: 1.25rem;
    font-weight: bold;
  }
`;

const Form = () => {
  const [showDataPicker, setShowDataPicker] = useState<boolean>(false);
  const [actualDate] = useState<number>(
    new Date().setTime(
      new Date().getTime() + new Date().getTimezoneOffset() * 60 * 1000
    )
  );

  const [name, setName] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [state, setState] = useState<string>("");
  const [date, setDate] = useState<Date>(new Date());

  const [pdfFile, setPdfFile] = useState<pdfType>({ base64: "", uri: "" });
  const [viewPdf, setViewPdf] = useState<boolean>(false);

  const changeDate: Function = (event: Event, date: Date) => {
    date && setDate(date);
    setShowDataPicker(false);
  };

  const verifyEmail: Function = (v: string) => {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (v.match(validRegex)) {
      return true;
    }

    return false;
  };

  const verifyFields: Function = () => {
    if (name !== "" && address !== "" && city !== "") {
      if (verifyEmail(email)) {
        if (state === "0") {
          Alert.alert("Atenção", "Selecione um estado!");
          return false;
        }

        return true;
      }

      Alert.alert("Atenção", "E-mail incorreto!");
      return false;
    }

    Alert.alert("Atenção", "Preencha todos os campos!");
    return false;
  };

  const generatePDF: Function = async () => {
    if (!verifyFields()) return;

    const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <style>
      ${pdfStyle}
    </style>  
  </head>
  <body style="text-align: center;">
  <h1 class="title">DECLARAÇÃO</h1>
  <br>
  <p id="mainText">
    &#8594; Eu, <mark><b>${name}</b></mark>, com e-mail <mark><b>${email}</b></mark>, que reside em <mark><b>${address}</b></mark>. Declaro que preenchi o formulário do desafio com objetivo de participar da seleção de vaga para Criative-Inc.
  </p>
  <br>
  <p id="confirmation">
    <b>Por ser a expressão da verdade, firmamos a presença da declaração.</b>
  </p>
  <br>
  <br>
  <p id="dateText">
    <mark>
      ${city} - ${state}, ${
      new Date(date).getDate().toLocaleString().length === 1
        ? "0" + new Date(date).getDate()
        : new Date(date).getDate()
    }/${
      new Date(date).getMonth().toLocaleString().length === 1
        ? "0" + (new Date(date).getMonth() + 1)
        : new Date(date).getMonth()
    }/${new Date(date).getFullYear()}
    </mark>
  </p>
  <br>
  <br>
  <div class="signatureContainer">
    <p id="signatureTitle">
      <i>Assinatura:</i>
      <mark>
        <b class="signature"> ${name}</b>
      </mark>
    </p>
  </div> 
  </body>
</html>
`;

    const { uri, base64 } = await Print.printToFileAsync({
      html,
      base64: true,
    });

    setPdfFile({ base64: `data:application/pdf;base64,${base64}`, uri });
    setViewPdf(true);
  };

  const savePdf: Function = async () => {
    await Sharing.shareAsync(pdfFile.uri);
  };

  return (
    <ScrollView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.text}>Nome</Text>
        <TextInput
          placeholder="Nome"
          autoCompleteType="name"
          style={styles.textInput}
          onChangeText={(text) => setName(text)}
        />
        <Text style={styles.text}>Endereço</Text>
        <TextInput
          placeholder="Endereço"
          autoCompleteType="street-address"
          style={styles.textInput}
          onChangeText={(text) => setAddress(text)}
        />
        <Text style={styles.text}>E-mail</Text>
        <TextInput
          placeholder="E-mail"
          autoCompleteType="email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.textInput}
          onChangeText={(text) => setEmail(text)}
        />
        <Text style={styles.text}>Cidade</Text>
        <TextInput
          placeholder="Cidade"
          style={styles.textInput}
          onChangeText={(text) => setCity(text)}
        />
        <Text style={styles.text}>Estado</Text>
        <Picker
          style={styles.statePicker}
          selectedValue={state}
          onValueChange={(v, _i) => setState(v)}
        >
          <Picker.Item label="Selecione um estado" value="0" />
          {states.states.map((e) => {
            return <Picker.Item key={e} label={e} value={e} />;
          })}
        </Picker>
        <TouchableOpacity
          activeOpacity={0.25}
          onPress={() => {
            setShowDataPicker(true);
          }}
          style={styles.dateContainer}
        >
          <Text
            style={{
              ...styles.text,
              alignItems: "center",
            }}
          >
            Data{"  "}
            <Text style={{ color: "rgba(0,0,0,0.45)", fontSize: 12 }}>
              (Clique para selecionar)
            </Text>
          </Text>
          <Text style={styles.datePickerText}>
            {`${
              new Date(date).getDate().toLocaleString().length === 1
                ? "0" + new Date(date).getDate()
                : new Date(date).getDate()
            }/${
              new Date(date).getMonth().toLocaleString().length === 1
                ? "0" + (new Date(date).getMonth() + 1)
                : new Date(date).getMonth()
            }/${new Date(date).getFullYear()}`}
          </Text>
        </TouchableOpacity>
        {showDataPicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date(actualDate)}
            onChange={changeDate}
            mode={"date"}
            is24Hour={true}
            display="default"
          />
        )}
        <TouchableOpacity
          activeOpacity={0.75}
          style={styles.generatePDFButton}
          onPress={generatePDF}
        >
          <Text style={styles.generatePDFButtonText}>Gerar PDF</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
      {viewPdf && (
        <View style={styles.pdfViewerContainer}>
          <PDFReader
            style={{ flex: 1 }}
            source={{
              base64: pdfFile.base64,
            }}
          />
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              savePdf();
            }}
            style={styles.savePdfButton}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <AntDesign
                name="save"
                size={24}
                color="white"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />

              <Text style={{ fontSize: 18, color: "white", marginLeft: 12 }}>
                Salvar
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.75}
            onPress={() => {
              setViewPdf(false);
            }}
            style={styles.closePdfButton}
          >
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
              }}
            >
              <AntDesign
                name="closesquare"
                size={24}
                color="white"
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />

              <Text style={{ fontSize: 18, color: "white", marginLeft: 12 }}>
                Fechar
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default Form;
