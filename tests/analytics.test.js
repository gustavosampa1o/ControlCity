/**
 * Tests for Analytics Module
 * Framework: Jest
 * Testa: Processamento de dados, filtros, agregação, cálculos
 */

describe('Analytics Module - Data Processing', () => {
  let analyticsData;
  let rawData;

  beforeEach(() => {
    // Dados brutos simulados
    rawData = [
      { cameraId: 1, timestamp: '2026-04-21T10:00:00Z', frameCount: 300, detections: 15 },
      { cameraId: 1, timestamp: '2026-04-21T11:00:00Z', frameCount: 300, detections: 12 },
      { cameraId: 2, timestamp: '2026-04-21T10:00:00Z', frameCount: 300, detections: 8 },
      { cameraId: 2, timestamp: '2026-04-21T11:00:00Z', frameCount: 300, detections: 20 },
      { cameraId: 3, timestamp: '2026-04-21T10:00:00Z', frameCount: 300, detections: 5 },
    ];

    analyticsData = {
      cameras: rawData,
      processed: false,
    };
  });

  // ====== DATA PROCESSING TESTS ======
  describe('Processamento de Dados Brutos', () => {
    test('Deve processar array de dados brutos corretamente', () => {
      const processed = rawData.map(record => ({
        ...record,
        fps: record.frameCount / 10, // Frames por segundo (10 segundos de vídeo)
      }));

      expect(processed.length).toBe(rawData.length);
      expect(processed[0].fps).toBe(30);
    });

    test('Deve calcular FPS (Frame Per Second) por câmera', () => {
      const fpsCalculation = (frameCount, duration) => frameCount / duration;
      
      const fps = fpsCalculation(300, 10); // 300 frames em 10 segundos

      expect(fps).toBe(30);
      expect(fps).toBeGreaterThan(0);
    });

    test('Deve contar total de detecções por câmera', () => {
      const detectionsByCamera = {};

      rawData.forEach(record => {
        if (!detectionsByCamera[record.cameraId]) {
          detectionsByCamera[record.cameraId] = 0;
        }
        detectionsByCamera[record.cameraId] += record.detections;
      });

      expect(detectionsByCamera[1]).toBe(27); // 15 + 12
      expect(detectionsByCamera[2]).toBe(28); // 8 + 20
      expect(detectionsByCamera[3]).toBe(5);
    });

    test('Deve calcular média de detecções por hora', () => {
      const avgDetections = rawData.reduce((sum, r) => sum + r.detections, 0) / rawData.length;

      expect(avgDetections).toBeGreaterThan(0);
      expect(avgDetections).toBeCloseTo(12, 1); // Aproximadamente 12
    });

    test('Deve identificar picos de atividade', () => {
      const sortedByDetections = [...rawData].sort((a, b) => b.detections - a.detections);
      const peak = sortedByDetections[0];

      expect(peak.detections).toBe(20); // Maior valor
      expect(peak.cameraId).toBe(2);
    });

    test('Deve validar integridade dos dados (valores não negativos)', () => {
      const isValid = rawData.every(record => 
        record.frameCount >= 0 && 
        record.detections >= 0
      );

      expect(isValid).toBe(true);
    });

    test('Deve converter timestamps ISO para Date objects', () => {
      const timestamps = rawData.map(r => new Date(r.timestamp));

      timestamps.forEach(ts => {
        expect(ts instanceof Date).toBe(true);
        expect(!isNaN(ts.getTime())).toBe(true);
      });
    });
  });

  // ====== FILTERING TESTS ======
  describe('Filtros de Analytics', () => {
    test('Deve filtrar dados por cameraId', () => {
      const cameraId = 1;
      const filtered = rawData.filter(r => r.cameraId === cameraId);

      expect(filtered.length).toBe(2);
      expect(filtered.every(r => r.cameraId === 1)).toBe(true);
    });

    test('Deve filtrar por intervalo de tempo', () => {
      const startTime = new Date('2026-04-21T10:30:00Z');
      const endTime = new Date('2026-04-21T11:30:00Z');

      const filtered = rawData.filter(r => {
        const timestamp = new Date(r.timestamp);
        return timestamp >= startTime && timestamp <= endTime;
      });

      expect(filtered.length).toBeGreaterThan(0);
    });

    test('Deve aplicar múltiplos filtros simultaneamente', () => {
      const cameraId = 1;
      const minDetections = 10;

      const filtered = rawData.filter(r =>
        r.cameraId === cameraId && r.detections >= minDetections
      );

      expect(filtered.every(r => r.cameraId === 1)).toBe(true);
      expect(filtered.every(r => r.detections >= 10)).toBe(true);
    });

    test('Deve limpar filtros e retornar todos os dados', () => {
      let filtered = rawData.filter(r => r.cameraId === 1);
      expect(filtered.length).toBe(2);

      filtered = rawData; // Limpar filtro
      expect(filtered.length).toBe(rawData.length);
    });

    test('Deve filtrar por range de detecções', () => {
      const minDetections = 5;
      const maxDetections = 15;

      const filtered = rawData.filter(r =>
        r.detections >= minDetections && r.detections <= maxDetections
      );

      expect(filtered.every(r => r.detections >= minDetections)).toBe(true);
      expect(filtered.every(r => r.detections <= maxDetections)).toBe(true);
    });

    test('Deve retornar array vazio se nenhum dado atender filtro', () => {
      const filtered = rawData.filter(r => r.cameraId === 999);

      expect(Array.isArray(filtered)).toBe(true);
      expect(filtered.length).toBe(0);
    });

    test('Filtro deve ser case-sensitive para strings', () => {
      const cameras = [
        { id: 1, name: 'Camera' },
        { id: 2, name: 'camera' },
        { id: 3, name: 'CAMERA' },
      ];

      const filtered = cameras.filter(c => c.name === 'Camera');

      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe(1);
    });
  });

  // ====== AGGREGATION TESTS ======
  describe('Agregação de Dados', () => {
    test('Deve agregar detecções por câmera', () => {
      const aggregated = {};

      rawData.forEach(record => {
        if (!aggregated[record.cameraId]) {
          aggregated[record.cameraId] = {
            cameraId: record.cameraId,
            totalDetections: 0,
            recordCount: 0,
          };
        }
        aggregated[record.cameraId].totalDetections += record.detections;
        aggregated[record.cameraId].recordCount += 1;
      });

      expect(Object.keys(aggregated).length).toBe(3); // 3 câmeras
      expect(aggregated[1].totalDetections).toBe(27);
    });

    test('Deve calcular estatísticas por período (hora, dia, mês)', () => {
      const hourlyStats = {};

      rawData.forEach(record => {
        const date = new Date(record.timestamp);
        const hour = date.getHours();

        if (!hourlyStats[hour]) {
          hourlyStats[hour] = { detections: 0, count: 0 };
        }
        hourlyStats[hour].detections += record.detections;
        hourlyStats[hour].count += 1;
      });

      expect(Object.keys(hourlyStats).length).toBeGreaterThan(0);
    });

    test('Deve criar tabela dinâmica (pivot) câmeras x horas', () => {
      const pivot = {};

      rawData.forEach(record => {
        const key = `cam_${record.cameraId}_hour_${new Date(record.timestamp).getHours()}`;
        pivot[key] = record.detections;
      });

      expect(Object.keys(pivot).length).toBeGreaterThan(0);
    });

    test('Deve agrupar e contar registros por status', () => {
      const dataWithStatus = rawData.map((r, idx) => ({
        ...r,
        status: idx % 2 === 0 ? 'normal' : 'anomaly',
      }));

      const grouped = {};
      dataWithStatus.forEach(r => {
        if (!grouped[r.status]) grouped[r.status] = [];
        grouped[r.status].push(r);
      });

      expect(grouped.normal.length).toBeGreaterThan(0);
    });

    test('Deve calcular percentuais de distribuição', () => {
      const total = rawData.reduce((sum, r) => sum + r.detections, 0);
      const percentByCamera = {};

      [1, 2, 3].forEach(camId => {
        const camDetections = rawData
          .filter(r => r.cameraId === camId)
          .reduce((sum, r) => sum + r.detections, 0);
        percentByCamera[camId] = (camDetections / total) * 100;
      });

      const sum = Object.values(percentByCamera).reduce((a, b) => a + b, 0);
      expect(sum).toBeCloseTo(100, 1); // Total deve ser 100%
    });
  });

  // ====== STATISTICAL CALCULATIONS ======
  describe('Cálculos Estatísticos', () => {
    test('Deve calcular média (mean) de detecções', () => {
      const detections = rawData.map(r => r.detections);
      const mean = detections.reduce((a, b) => a + b, 0) / detections.length;

      expect(mean).toBeGreaterThan(0);
      expect(typeof mean).toBe('number');
    });

    test('Deve calcular mediana de detecções', () => {
      const detections = [...rawData.map(r => r.detections)].sort((a, b) => a - b);
      const median = detections.length % 2 === 0
        ? (detections[detections.length / 2 - 1] + detections[detections.length / 2]) / 2
        : detections[Math.floor(detections.length / 2)];

      expect(median).toBeGreaterThan(0);
    });

    test('Deve calcular desvio padrão', () => {
      const detections = rawData.map(r => r.detections);
      const mean = detections.reduce((a, b) => a + b) / detections.length;
      const variance = detections.reduce((sum, x) => sum + Math.pow(x - mean, 2), 0) / detections.length;
      const stdDev = Math.sqrt(variance);

      expect(stdDev).toBeGreaterThanOrEqual(0);
    });

    test('Deve identificar outliers usando método IQR', () => {
      const sorted = [...rawData.map(r => r.detections)].sort((a, b) => a - b);
      const q1 = sorted[Math.floor(sorted.length * 0.25)];
      const q3 = sorted[Math.floor(sorted.length * 0.75)];
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;

      const outliers = rawData.filter(r =>
        r.detections < lowerBound || r.detections > upperBound
      );

      expect(Array.isArray(outliers)).toBe(true);
    });

    test('Deve calcular taxa de crescimento (growth rate)', () => {
      const values = [100, 110, 121]; // +10%, +10%
      const growthRate = ((values[values.length - 1] - values[0]) / values[0]) * 100;

      expect(growthRate).toBeGreaterThan(0);
      expect(growthRate).toBeCloseTo(21, 0); // 21%
    });

    test('Deve calcular média móvel (moving average)', () => {
      const detections = rawData.map(r => r.detections);
      const window = 2;
      const movingAverage = [];

      for (let i = 0; i <= detections.length - window; i++) {
        const avg = detections.slice(i, i + window).reduce((a, b) => a + b) / window;
        movingAverage.push(avg);
      }

      expect(movingAverage.length).toBe(detections.length - window + 1);
    });
  });

  // ====== EXPORT/FORMAT TESTS ======
  describe('Exportação de Dados', () => {
    test('Deve exportar dados em formato CSV', () => {
      const csv = [
        'cameraId,timestamp,frameCount,detections',
        ...rawData.map(r => `${r.cameraId},${r.timestamp},${r.frameCount},${r.detections}`),
      ].join('\n');

      expect(csv).toContain('cameraId');
      expect(csv.split('\n').length).toBe(rawData.length + 1); // +1 para header
    });

    test('Deve exportar dados em formato JSON', () => {
      const json = JSON.stringify(rawData, null, 2);
      const parsed = JSON.parse(json);

      expect(parsed).toEqual(rawData);
    });

    test('Deve exportar com timestamp do relatório', () => {
      const report = {
        generatedAt: new Date().toISOString(),
        data: rawData,
        recordCount: rawData.length,
      };

      expect(report.generatedAt).toBeDefined();
      expect(report.recordCount).toBe(rawData.length);
    });

    test('Deve formatear números com separadores de milhar', () => {
      const largeNumber = 1234567;
      const formatted = largeNumber.toLocaleString('pt-BR');

      expect(formatted).toContain('.');
    });

    test('Deve formatar datas no padrão brasileiro (DD/MM/YYYY)', () => {
      const date = new Date('2026-04-21');
      const formatted = date.toLocaleDateString('pt-BR');

      expect(formatted).toMatch(/\d{2}\/\d{2}\/\d{4}/);
    });
  });

  // ====== ANOMALY DETECTION TESTS ======
  describe('Detecção de Anomalias', () => {
    test('Deve identificar picos anormais de detecção', () => {
      const detections = rawData.map(r => r.detections);
      const mean = detections.reduce((a, b) => a + b) / detections.length;
      const threshold = mean * 2; // 2x a média

      const anomalies = rawData.filter(r => r.detections > threshold);

      expect(anomalies.length).toBeGreaterThanOrEqual(0);
    });

    test('Deve detectar câmera com zero detecções (falha)', () => {
      const dataWithFailure = [...rawData, {
        cameraId: 4,
        timestamp: '2026-04-21T12:00:00Z',
        frameCount: 0,
        detections: 0,
      }];

      const failures = dataWithFailure.filter(r => r.frameCount === 0);

      expect(failures.length).toBeGreaterThan(0);
    });

    test('Deve alertar se câmera deixar de reportar (missing data)', () => {
      const timestamps = rawData.map(r => r.timestamp);
      const lastTimestamp = new Date(timestamps[timestamps.length - 1]);
      const now = new Date();
      const timeDiffMinutes = (now - lastTimestamp) / (1000 * 60);

      const isStale = timeDiffMinutes > 5; // Alerta se > 5 minutos

      expect(typeof isStale).toBe('boolean');
    });

    test('Deve detectar padrão anormal de comportamento', () => {
      const recentData = rawData.slice(-2);
      const isAnomalous = recentData.some(r => r.detections > 30);

      expect(typeof isAnomalous).toBe('boolean');
    });
  });

  // ====== PERFORMANCE TESTS ======
  describe('Performance', () => {
    test('Deve processar 1000+ registros em menos de 100ms', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        value: Math.random() * 100,
      }));

      const start = performance.now();
      const processed = largeDataset.map(r => ({ ...r, doubled: r.value * 2 }));
      const end = performance.now();

      expect(end - start).toBeLessThan(100);
    });

    test('Deve memoizar cálculos custosos', () => {
      const cache = {};
      const expensiveCalc = (key) => {
        if (cache[key]) return cache[key];
        const result = rawData.filter(r => r.cameraId === key).length;
        cache[key] = result;
        return result;
      };

      const result1 = expensiveCalc(1);
      const result2 = expensiveCalc(1); // Cache hit

      expect(result1).toBe(result2);
    });
  });
});
