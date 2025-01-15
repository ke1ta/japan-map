import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

// 地図の初期設定
const map = new maplibregl.Map({
  container: 'map',
  style: {
    version: 8,
    sources: {},
    layers: []
  },
  center: [139.7024, 35.6598], // 中心座標
  zoom: 16, // ズームレベル
});

// 地図の読み込み完了後に日本地図を追加
map.on('load', async () => {
  // GeoJSONデータを取得
  const response = await fetch('N03-21_210101_designated_city.json');
  const geojson = await response.json();
  
  // 地図にレイヤーを追加
  map.addSource('japan', {
    type: 'geojson',
    data: geojson,
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
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "14131" // 川崎市川崎区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "14151" // 相模原市中央区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "15101" // 新潟市中央区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "22101" // 静岡市葵区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "22131" // 浜松市中区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "23101" // 名古屋市中区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "26101" // 京都市中京区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "27101" // 大阪市北区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "27141" // 堺市堺区
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
          "N03_007": "33101" // 岡山市北区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "34101" // 広島市中区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "40101" // 北九州市小倉北区
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
          "N03_007": "43101" // 熊本市中央区
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
          "N03_007": "13103" // 東京都港区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "13104" // 東京都新宿区
        }
      },
      {
        "type": "Feature",
        "properties": {
          "N03_007": "13113" // 東京都渋谷区
        }
      }
    ]
  };

  map.addLayer({
    id: 'japan-fill',
    type: 'fill',
    source: 'japan',
    paint: {
      'fill-color': [
        'case',
        [
          'in',
          ['get', 'N03_007'],
          ['literal', hogeArea.features.map(f => f.properties.N03_007)]
        ],
        'rgba(0, 191, 255, 0.8)', // 濃い水色
        '#CCCCCC' // 薄い灰色
      ],
      'fill-opacity': 0.8,
      'fill-outline-color': '#000000' // 境界線
    }
  });

  // 市区町村をクリックした時の処理
  map.on('click', 'japan-fill', (e) => {
    const feature = e.features[0];
    const areaName = feature.properties.N03_004 || 
                     feature.properties.N03_003 || 
                     feature.properties.N03_002;
    
    // クリックしたエリアの色を変更
    map.setPaintProperty('japan-fill', 'fill-color', [
      'case',
      ['==', ['get', 'N03_007'], feature.properties.N03_007],
      '#FF0000',
      [
        'case',
        [
          'in',
          ['get', 'N03_007'],
          ['literal', hogeArea.features.map(f => f.properties.N03_007)]
        ],
        'rgba(0, 191, 255, 0.8)',
        '#CCCCCC'
      ]
    ]);
    
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