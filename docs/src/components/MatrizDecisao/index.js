import React, {useMemo, useState} from 'react';
import styles from './styles.module.css';

// Simulador da matriz multicritério: mesmos cálculos da planilha (AHP, matriz ponderada e filtro eliminatório).

const CRITERIOS = [
  {id: 'C1', nome: 'Disponibilidade para itens críticos'},
  {id: 'C2', nome: 'Capital imobilizado'},
  {id: 'C3', nome: 'Custo de transporte'},
  {id: 'C4', nome: 'Governança'},
  {id: 'C5', nome: 'Escala de armazenagem'},
  {id: 'C6', nome: 'Resiliência'},
];
const ALTERNATIVAS = ['Centralizado', 'Descentralizado', 'Híbrido'];
const RI = 1.24; // índice aleatório de Saaty para n = 6

const JULGAMENTOS_INICIAIS = {
  '0-1': 3, '0-2': 5, '0-3': 5, '0-4': 5, '0-5': 3,
  '1-2': 3, '1-3': 3, '1-4': 3, '1-5': 1,
  '2-3': 1, '2-4': 1, '2-5': 1 / 3,
  '3-4': 1, '3-5': 1 / 3,
  '4-5': 1 / 3,
};

const CENARIOS = {
  base: {
    rotulo: 'Cenário base (CD a 600 km)',
    distanciaCD: 600,
    notas: {
      Centralizado: [2, 5, 2, 5, 5, 1],
      Descentralizado: [5, 1, 3, 2, 1, 5],
      Híbrido: [4, 4, 4, 3, 4, 4],
    },
  },
  concentrada: {
    rotulo: 'Rede concentrada (CD a 100 km)',
    distanciaCD: 100,
    notas: {
      Centralizado: [4, 5, 4, 5, 5, 2],
      Descentralizado: [5, 1, 3, 2, 1, 5],
      Híbrido: [4, 4, 4, 3, 4, 4],
    },
  },
};

const PREMISSAS_FIXAS = {distanciaPool: 150, velocidade: 60, tempoForaTransporte: 4, tempoLocal: 2};

const ESCALA_SAATY = [9, 8, 7, 6, 5, 4, 3, 2, 1, 1 / 2, 1 / 3, 1 / 4, 1 / 5, 1 / 6, 1 / 7, 1 / 8, 1 / 9];
const rotuloSaaty = (v) => (v >= 1 ? String(Math.round(v)) : `1/${Math.round(1 / v)}`);
const fmt = (v, casas = 2) => v.toFixed(casas).replace('.', ',');
const pct = (v) => `${(v * 100).toFixed(1).replace('.', ',')}%`;

function calcularPesos(julgamentos) {
  const n = CRITERIOS.length;
  // Array.from em vez de [...Array(n)]: o build transpila o spread de forma que o map pula as posições.
  const A = Array.from({length: n}, (_, i) =>
    Array.from({length: n}, (__, j) => {
      if (i === j) return 1;
      return i < j ? julgamentos[`${i}-${j}`] : 1 / julgamentos[`${j}-${i}`];
    }),
  );
  const medias = A.map((linha) => Math.pow(linha.reduce((a, b) => a * b, 1), 1 / n));
  const soma = medias.reduce((a, b) => a + b, 0);
  const pesos = medias.map((m) => m / soma);
  const lambdaMax = A.map((linha, i) => linha.reduce((a, v, j) => a + v * pesos[j], 0) / pesos[i]).reduce((a, b) => a + b, 0) / n;
  const cr = (lambdaMax - n) / (n - 1) / RI;
  return {pesos, cr};
}

export default function MatrizDecisao() {
  const [julgamentos, setJulgamentos] = useState(JULGAMENTOS_INICIAIS);
  const [cenario, setCenario] = useState('base');
  const [notas, setNotas] = useState(CENARIOS.base.notas);
  const [distanciaCD, setDistanciaCD] = useState(CENARIOS.base.distanciaCD);
  const [limite, setLimite] = useState(8);

  const {pesos, cr} = useMemo(() => calcularPesos(julgamentos), [julgamentos]);

  const resultados = useMemo(() => {
    const {distanciaPool, velocidade, tempoForaTransporte, tempoLocal} = PREMISSAS_FIXAS;
    const tempos = {
      Centralizado: tempoForaTransporte + distanciaCD / velocidade,
      Descentralizado: tempoLocal,
      Híbrido: Math.max(tempoLocal, tempoForaTransporte + distanciaPool / velocidade),
    };
    const linhas = ALTERNATIVAS.map((alt) => ({
      alt,
      nota: notas[alt].reduce((a, v, k) => a + v * pesos[k], 0),
      tempo: tempos[alt],
      passa: tempos[alt] <= limite,
    }));
    linhas.forEach((l) => {
      l.posicao = l.passa ? 1 + linhas.filter((o) => o.passa && o.nota > l.nota).length : null;
    });
    return linhas;
  }, [notas, pesos, distanciaCD, limite]);

  const aplicarCenario = (chave) => {
    setCenario(chave);
    setNotas(CENARIOS[chave].notas);
    setDistanciaCD(CENARIOS[chave].distanciaCD);
  };
  const restaurar = () => {
    setJulgamentos(JULGAMENTOS_INICIAIS);
    setLimite(8);
    aplicarCenario('base');
  };
  const mudarNota = (alt, k, valor) => {
    setCenario('personalizado');
    setNotas((atual) => ({...atual, [alt]: atual[alt].map((v, i) => (i === k ? valor : v))}));
  };

  const pares = [];
  for (let i = 0; i < CRITERIOS.length; i++) for (let j = i + 1; j < CRITERIOS.length; j++) pares.push([i, j]);

  return (
    <div className={styles.simulador}>
      <div className={styles.barraTopo}>
        <span className={styles.rotuloGrupo}>Cenário:</span>
        {Object.entries(CENARIOS).map(([chave, c]) => (
          <button key={chave} type="button" onClick={() => aplicarCenario(chave)}
            className={`${styles.botao} ${cenario === chave ? styles.botaoAtivo : ''}`}>
            {c.rotulo}
          </button>
        ))}
        <button type="button" onClick={restaurar} className={styles.botaoSecundario}>Restaurar valores do projeto</button>
      </div>

      <div className={styles.secao}>
        <h4>1. Premissas do filtro eliminatório</h4>
        <div className={styles.premissas}>
          <label>Distância até o CD central (km)
            <input type="number" min="0" step="10" value={distanciaCD}
              onChange={(e) => { setCenario('personalizado'); setDistanciaCD(Math.max(0, Number(e.target.value))); }} />
          </label>
          <label>Tempo tolerável de parada (h)
            <input type="number" min="0" step="0.5" value={limite} onChange={(e) => setLimite(Math.max(0, Number(e.target.value)))} />
          </label>
        </div>
        <p className={styles.nota}>Fixas: pool regional a {PREMISSAS_FIXAS.distanciaPool} km, {PREMISSAS_FIXAS.velocidade} km/h,
          {' '}{PREMISSAS_FIXAS.tempoForaTransporte} h fora do transporte e {PREMISSAS_FIXAS.tempoLocal} h com o item na usina (página de SIPOC).</p>
      </div>

      <div className={styles.secao}>
        <h4>2. Pesos dos critérios (AHP)</h4>
        <p className={styles.nota}>Cada número indica quanto o primeiro critério é mais importante que o segundo (escala de Saaty: 1 = igual, 9 = extremamente mais importante; frações invertem a relação).</p>
        <div className={styles.pares}>
          {pares.map(([i, j]) => (
            <label key={`${i}-${j}`} className={styles.par}>
              <span>{CRITERIOS[i].id} × {CRITERIOS[j].id}</span>
              <select value={julgamentos[`${i}-${j}`]}
                onChange={(e) => setJulgamentos((a) => ({...a, [`${i}-${j}`]: Number(e.target.value)}))}>
                {ESCALA_SAATY.map((v) => <option key={v} value={v}>{rotuloSaaty(v)}</option>)}
              </select>
            </label>
          ))}
        </div>
        <ul className={styles.pesos}>
          {CRITERIOS.map((c, k) => (
            <li key={c.id}>
              <span className={styles.pesoNome}>{c.id}. {c.nome}</span>
              <span className={styles.pesoTrilha}><span className={styles.pesoBarra} style={{width: `${pesos[k] * 100}%`}} /></span>
              <span className={styles.pesoValor}>{pct(pesos[k])}</span>
            </li>
          ))}
        </ul>
        <p className={cr < 0.1 ? styles.ok : styles.alerta}>
          Razão de consistência (CR): {fmt(cr, 3)} — {cr < 0.1 ? 'julgamentos consistentes (abaixo de 0,10)' : 'revisar julgamentos (0,10 ou mais)'}
        </p>
      </div>

      <div className={styles.secao}>
        <h4>3. Notas de 1 a 5 (escala ancorada)</h4>
        <div className={styles.tabelaRolagem}>
          <table className={styles.tabela}>
            <thead>
              <tr><th>Critério</th><th>Peso</th>{ALTERNATIVAS.map((a) => <th key={a}>{a}</th>)}</tr>
            </thead>
            <tbody>
              {CRITERIOS.map((c, k) => (
                <tr key={c.id}>
                  <td>{c.id}. {c.nome}</td>
                  <td>{pct(pesos[k])}</td>
                  {ALTERNATIVAS.map((a) => (
                    <td key={a}>
                      <select aria-label={`Nota de ${a} em ${c.nome}`} value={notas[a][k]} onChange={(e) => mudarNota(a, k, Number(e.target.value))}>
                        {[5, 4, 3, 2, 1].map((v) => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.secao}>
        <h4>4. Resultado</h4>
        <ul className={styles.resultados}>
          {resultados.map((r) => (
            <li key={r.alt} className={r.passa ? '' : styles.eliminada}>
              <span className={styles.resNome}>{r.alt}</span>
              <span className={styles.resTrilha}>
                <span className={`${styles.resBarra} ${styles[`alt${ALTERNATIVAS.indexOf(r.alt)}`]}`} style={{width: `${(r.nota / 5) * 100}%`}} />
              </span>
              <span className={styles.resNota}>{fmt(r.nota)}</span>
              <span className={styles.resStatus}>
                {r.passa ? `${r.posicao}º lugar` : 'Eliminada no filtro'} · atendimento em {fmt(r.tempo, 1)} h
              </span>
            </li>
          ))}
        </ul>
        <p className={styles.nota}>O resultado apoia a análise de um cenário genérico. Não é recomendação para a Atvos nem para o case real.</p>
      </div>
    </div>
  );
}
