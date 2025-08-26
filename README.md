# FireMap Project Documentation

## PDF Documentation (Detailed)

### 1. initializeMap()

* Inicializa o mapa usando Leaflet.
* Define a visualização inicial, limites de zoom e camada base.
* Cria um cluster de marcadores para focos de incêndio.
* Chama `fetchFireData()` e `fetchWindData()` para carregar dados.

### 2. toggleLoadingScreen()

* Mostra ou oculta a tela de loading.
* Baseado na variável `loading` que controla quantos processos estão carregando.

### 3. fetchFireData()

* Busca dados de focos de incêndio da API da NASA FIRMS.
* Usa o `dayRange` para definir o período de dados (24h, 48h, 7 dias, etc).
* Converte o CSV retornado em JSON usando `d3.csvParse()`.
* Popula a array `markers` com latitude, longitude, brilho, confiança e hora do foco.
* Chama `updateFireMarkers()` para desenhar os marcadores no mapa.
* Controla a tela de loading.

### 4. updateFireMarkers()

* Limpa a camada de cluster anterior.
* Se a visualização de focos estiver ativada, adiciona cada marcador ao cluster.
* Cor do marcador é determinada pelo brilho (`getMarkerColor()`).

### 5. getMarkerColor(brightness)

* Define a cor do marcador de acordo com o brilho do foco.
* Vermelho para >400, laranja >350, amarelo para o resto.

### 6. fetchWindData()

* Busca dados de vento de um arquivo JSON local (`gfs.json`).
* Cria uma camada de vento (`velocityLayer`) usando Leaflet Velocity.
* Adiciona a camada ao mapa se `showWind` estiver ativado.
* Controla a tela de loading.

### 7. Event Listeners

* Toggle Fire Markers: ativa/desativa marcadores de incêndio.
* Toggle Velocity: ativa/desativa camada de vento.
* Day Range Change: atualiza os focos de incêndio de acordo com o período selecionado.

### Variáveis principais

* `map`: objeto do Leaflet.
* `velocityLayer`: camada de vento.
* `markers`: array com dados de focos de incêndio.
* `loading`: controla quantos processos ainda estão carregando.
* `state`: guarda estado de visualização de vento e focos.

### Observações

* A tela de loading aparece enquanto os dados estão sendo buscados e desaparece quando todos os dados são carregados.
* A camada de vento depende do arquivo JSON local.
* Para focos de incêndio, o CORS precisa estar habilitado para acessar a API da NASA.

---

## README.md

# FireMap

Projeto de visualização de focos de incêndio e vento usando Leaflet.

## Como Rodar

1. Clone o repositório:

```bash
git clone https://github.com/usuario/firemap.git
```

2. Abra `index.html` em um navegador. Se houver problemas de CORS ao buscar dados da NASA, use uma extensão de CORS (ex: "Allow CORS" no Chrome).

3. Certifique-se que `gfs.json` está na mesma pasta do `firemap.js`.

## Funcionalidades

* Visualização de focos de incêndio em cluster.
* Camada de vento animada.
* Filtro por período de dados de incêndio (24h, 48h, 7 dias, 30 dias).
* Alternar visibilidade de focos de incêndio e vento.
* Tela de loading enquanto os dados carregam.
* Alternar mapa entre tema claro e escuro.

## Estrutura do Projeto

```
firemap/
│
├── index.html
├── firemap.js
├── firemap.css
├── gfs.json
└── README.md
```

## Dependências

* Leaflet
* Leaflet.markercluster
* Leaflet.heat (opcional)
* Leaflet.velocity
* D3.js

## Observações

* Focos de incêndio dependem de API da NASA FIRMS (requer chave de API).
* Vento depende do arquivo `gfs.json` local.
* Para apresentações offline, recomenda-se usar a extensão de CORS ou hospedar os arquivos em servidor local.
