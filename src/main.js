import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import japanMapJson from '../public/N03-21_210101.json'

// 地図の初期設定
const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {},
    layers: []
  },
  center: [139.7024, 35.6598],
  zoom: 8,
});

// 地図の読み込み完了後に日本地図を追加
map.on('load', async () => {
  // GeoJSONデータを取得
  // const response = await fetch('N03-21_210101.json');
  // const geojson = await response.json();
  
  // 地図にレイヤーを追加
  map.addSource('japan', {
    type: 'geojson',
    data: japanMapJson,
    generateId: true
  });

  // 特定の地域を定義（市区町村コード単位）
  const hogeArea = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "N03_007": "01101" // 札幌市中央区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "04101" // 仙台市青葉区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "11101" // さいたま市浦和区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "12101" // 千葉市中央区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "14101" // 横浜市中区
        }
      }
    ]
  };

  // 別の地域を定義
  const fugaArea = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {
          "N03_007": "27101" // 大阪市北区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "28101" // 神戸市中央区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "40131" // 福岡市中央区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "13101" // 東京都千代田区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "23101" // 名古屋市中区
        }
      }
    ]
  };

  // エリアの表示状態を管理
  let showHogeArea = true;
  let showFugaArea = true;

  // 色分け処理を更新する関数
  const updateColors = () => {
    map.setPaintProperty('japan-fill', 'fill-color', [
      'case',
      ['==', ['get', 'N03_007'], selectedAreaCode],
      '#FF0000', // クリックされたエリア
      [
        'case',
        [
          'in',
          ['get', 'N03_007'],
          ['literal', showHogeArea ? hogeArea.features.map(f => f.properties.N03_007) : null]
        ],
        'rgba(0, 191, 255, 0.8)', // hogeArea
        [
          'case',
          [
            'in',
            ['get', 'N03_007'],
            ['literal', showFugaArea ? fugaArea.features.map(f => f.properties.N03_007) : null]
          ],
          'rgba(255, 165, 0, 0.8)', // fugaArea（オレンジ色）
          '#CCCCCC' // その他
        ]
      ]
    ]);
  };

  // レイヤーを追加
  map.addLayer({
    id: 'japan-fill',
    type: 'fill',
    source: 'japan',
    paint: {
      'fill-color': '#CCCCCC',
      'fill-opacity': 0.8,
      'fill-outline-color': '#000000'
    }
  });

  // 初期表示
  let selectedAreaCode = null;
  updateColors();

  // チェックボックスのイベントリスナー
  const hogeCheckbox = document.getElementById('hogeArea');
  const fugaCheckbox = document.getElementById('fugaArea');

  if (hogeCheckbox && fugaCheckbox) {
    hogeCheckbox.addEventListener('change', (e) => {
      console.log('hogeArea changed:', e.target.checked);
      showHogeArea = e.target.checked;
      updateColors();
    });

    fugaCheckbox.addEventListener('change', (e) => {
      console.log('fugaArea changed:', e.target.checked);
      showFugaArea = e.target.checked;
      updateColors();
    });
  } else {
    console.error('Checkboxes not found');
  }

  // 市区町村をクリックした時の処理
  map.on('click', 'japan-fill', (e) => {
    const feature = e.features[0];
    selectedAreaCode = feature.properties.N03_007;
    const areaName = feature.properties.N03_004 || 
                     feature.properties.N03_003 || 
                     feature.properties.N03_002;
    
    updateColors();
    
    // クリックしたエリア名を表示
    new maplibregl.Popup({
      offset: 25,
      closeButton: false
    })
      .setLngLat(e.lngLat)
      .setText(`${areaName}`)
      .addTo(map);
  });
});