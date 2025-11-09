Para fazer a funcionalidade do app perfeitamente clone o projeto java numa pasta vazia
git clone https://github.com/caiolucasxz55/VitsAPI.git

depois clique em vitsAgrochainAplication e rode o programa

nisso starte o app e navegue pelas novas funcionalidades.

caso nao consiga dar npm install por causa de dependencias ( do prorio react-native)
rode: npm install --legacy-peer-deps


# Verdantis Mobile App 📱🌾

<div align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/NativeWind-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="NativeWind" />
</div>

<br />

<div align="center">
  <h3>🚀 Rastreabilidade do Agronegócio na Palma da Mão</h3>
  <p>Aplicativo móvel completo para gestão e rastreabilidade agrícola com tecnologia blockchain</p>
</div>

## 📋 Sobre o Projeto

O **Verdantis Mobile App** é o aplicativo móvel oficial da plataforma Verdantis, desenvolvido para levar a rastreabilidade blockchain e a gestão inteligente do agronegócio diretamente para o campo. Com interface intuitiva e funcionalidades offline-first, o app permite que produtores rurais, cooperativas e outros stakeholders gerenciem suas operações em qualquer lugar.

### 🎯 Missão

Democratizar o acesso à tecnologia de rastreabilidade, permitindo que produtores rurais de qualquer porte possam certificar suas práticas sustentáveis e acessar mercados premium globais através de seus smartphones.

## ✨ Funcionalidades Principais

### 🌱 Para Produtores Rurais

- **Cadastro de Propriedades**
  - Mapeamento GPS em tempo real
  - Definição de talhões e áreas de cultivo
  - Registro fotográfico georreferenciado
  - Documentação de recursos hídricos

- **Gestão de Cultivos**
  - Planejamento de plantio
  - Registro de atividades diárias
  - Controle de insumos e aplicações
  - Histórico de safras

- **Rastreabilidade Instantânea**
  - Scanner QR Code para produtos
  - Registro de colheita com timestamp blockchain
  - Geração de lotes rastreáveis
  - Compartilhamento de certificados digitais

- **Dashboard Mobile**
  - Métricas de produtividade
  - Indicadores de sustentabilidade
  - Alertas e notificações push
  - Status de certificações

### 🤝 Para Cooperativas

- Agregação de produtores
- Consolidação de lotes
- Gestão coletiva de certificações
- Relatórios consolidados

### 🔍 Para Compradores/Mercado

- Verificação de autenticidade
- Consulta de histórico completo
- Acesso a certificações
- Portal de transparência

## 🛠️ Stack Tecnológica

### Core
- **Framework**: React Native
- **Platform**: Expo SDK (Managed Workflow)
- **Linguagem**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation 6

### Features & Integrations
- **Maps**: react-native-maps / Mapbox
- **Location**: expo-location
- **Camera**: expo-camera / react-native-vision-camera
- **QR Code**: expo-barcode-scanner
- **Blockchain**: Web3.js / Ethers.js integration
- **Offline Sync**: WatermelonDB Sync / Redux Offline

### UI Components
- **Component Library**: Custom + React Native Elements / NativeBase
- **Icons**: Expo Vector Icons / Lucide React Native
- **Charts**: Victory Native / React Native Chart Kit
- **Forms**: React Hook Form

### Developer Experience
- **Type Checking**: TypeScript
- **Linting**: ESLint
- **Formatting**: Prettier
- **Testing**: Jest + React Native Testing Library
- **E2E Testing**: Detox / Maestro

## 📱 Plataformas Suportadas

- ✅ **iOS**: 13.0+
- ✅ **Android**: 6.0+ (API Level 23+)

## 🚀 Começando

### Pré-requisitos

- Node.js 18+ instalado
- npm, yarn ou pnpm
- Expo CLI (`npm install -g expo-cli`)
- Para iOS: Xcode 14+ (apenas macOS)
- Para Android: Android Studio

### Instalação

```bash
# Clone o repositório
git clone https://github.com/caiolucasxz55/verdantis-app.git

# Entre no diretório
cd verdantis-app

# Instale as dependências
npm install
# ou
yarn install
```

### Executar em Desenvolvimento

```bash
# Iniciar Expo Dev Server
npm start
# ou
yarn start
# ou
expo start

# Executar no iOS
npm run ios
# ou
yarn ios

# Executar no Android
npm run android
# ou
yarn android
```

## 🎨 Design System

### Cores Principais
```javascript
{
  primary: '#10B981',      // Verde Verdantis
  secondary: '#059669',    // Verde Escuro
  background: '#F9FAFB',   // Cinza Claro
  surface: '#FFFFFF',
  error: '#EF4444',
  warning: '#F59E0B',
  success: '#10B981',
  text: {
    primary: '#111827',
    secondary: '#6B7280',
    disabled: '#9CA3AF',
  }
}
```

### Tipografia
- **Display**: Inter Bold / Poppins Bold
- **Heading**: Inter SemiBold
- **Body**: Inter Regular
- **Caption**: Inter Regular

## 📸 Screenshots

<div align="center">
  <img src="./assets/screenshots/home.png" width="200" alt="Home" />
  <img src="./assets/screenshots/dashboard.png" width="200" alt="Dashboard" />
  <img src="./assets/screenshots/scanner.png" width="200" alt="Scanner" />
  <img src="./assets/screenshots/map.png" width="200" alt="Mapa" />
</div>


## 📊 Performance

- ⚡ Carregamento inicial < 3s
- ⚡ Navegação fluida (60 FPS)
- ⚡ Lazy loading de imagens
- ⚡ Código otimizado com Hermes
- ⚡ Bundle size otimizado

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.



## 👥 Time

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/caiolucasxz55">
        <img src="https://github.com/caiolucasxz55.png" width="100px;" alt="Caio Lucas"/><br />
        <sub><b>Caio Lucas</b></sub>
      </a><br />
      <sub>Developer</sub>
    </td>
  </tr>
</table>


## 🔗 Links Relacionados

- 🌐 [Landing Page](https://verdantis-landing.vercel.app/)
- 💻 [WebApp](https://verdantis-webapp-vits.vercel.app/)

---

<div align="center">
  <strong>Transformando o campo brasileiro com tecnologia mobile</strong>
  <br><br>
  Feito com 💚 pela equipe Verdantis
  <br><br>
  <a href="https://github.com/caiolucasxz55/verdantis-app/stargazers">⭐ Star no GitHub</a> •
  <a href="https://github.com/caiolucasxz55/verdantis-app/issues">🐛 Reportar Bug</a> •
  <a href="https://github.com/caiolucasxz55/verdantis-app/discussions">💬 Discussões</a>
</div>
