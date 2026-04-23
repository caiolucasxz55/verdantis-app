import React, { useRef, useState } from "react";
import { View, StyleSheet, Alert, ActivityIndicator, Platform } from "react-native";
import QRCode from "react-native-qrcode-svg";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";
import PrimaryButton from "./PrimaryButton";

type Props = {
  qrValue: string;
  pdfHtml?: string;
  fileBaseName?: string;
};

export default function DownloadButtons({ qrValue, pdfHtml, fileBaseName = "verdantis" }: Props) {
  const qrRef = useRef<any>(null);
  const [busyQr, setBusyQr] = useState(false);
  const [busyPdf, setBusyPdf] = useState(false);

  async function handleDownloadQr() {
    if (!qrRef.current) return Alert.alert("Erro", "QR não disponível");
    try {
      setBusyQr(true);
      // toDataURL provides base64 (sometimes with data: prefix)
      qrRef.current.toDataURL(async (data: string) => {
        try {
          let base64 = data;
          const prefix = "data:image/png;base64,";
          if (base64.startsWith(prefix)) base64 = base64.slice(prefix.length);
          const filename = `${FileSystem.cacheDirectory}${fileBaseName}_qrcode_${Date.now()}.png`;
          await FileSystem.writeAsStringAsync(filename, base64, { encoding: FileSystem.EncodingType.Base64 });
          if (!(await Sharing.isAvailableAsync())) {
            Alert.alert("Pronto", `QR salvo em: ${filename}`);
            return;
          }
          await Sharing.shareAsync(filename, { mimeType: "image/png" });
        } catch (err) {
          console.error("Erro gerando/compartilhando QR:", err);
          Alert.alert("Erro", "Não foi possível exportar o QR code.");
        } finally {
          setBusyQr(false);
        }
      });
    } catch (err) {
      console.error(err);
      setBusyQr(false);
      Alert.alert("Erro", "Falha ao gerar QR.");
    }
  }

  async function handleDownloadPdf() {
    if (!pdfHtml) return Alert.alert("Erro", "Conteúdo PDF não fornecido.");
    try {
      setBusyPdf(true);
      const { uri } = await Print.printToFileAsync({ html: pdfHtml });
      if (!uri) throw new Error("PDF gerado sem URI");
      if (!(await Sharing.isAvailableAsync())) {
        Alert.alert("Pronto", `PDF gerado em: ${uri}`);
        setBusyPdf(false);
        return;
      }
      // On Android it's better to copy to a sharable location but Sharing.shareAsync should handle it
      await Sharing.shareAsync(uri, { mimeType: "application/pdf" });
    } catch (err) {
      console.error("Erro gerando/compartilhando PDF:", err);
      Alert.alert("Erro", "Não foi possível gerar o PDF.");
    } finally {
      setBusyPdf(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.qrWrapper}>
        <QRCode value={qrValue || ""} size={120} getRef={(c) => (qrRef.current = c)} />
      </View>

      <PrimaryButton label={busyQr ? "Gerando QR..." : "Baixar QR"} onPress={handleDownloadQr} style={styles.btn} />
      <PrimaryButton label={busyPdf ? "Gerando PDF..." : "Baixar PDF"} onPress={handleDownloadPdf} style={styles.btn} />

      {(busyQr || busyPdf) && <ActivityIndicator style={styles.indicator} size="small" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 18 },
  qrWrapper: { alignItems: "center", marginBottom: 12 },
  btn: { marginTop: 10 },
  indicator: { marginTop: 8 },
});
