import { useEffect, useRef } from 'react';
import Phaser from 'phaser';

export default function CenarioPhaser({ aoAcertar, aoErrar, aoGuardar }) {
  const gameRef = useRef(null);

  useEffect(() => {
    class CenaJogoFix extends Phaser.Scene {
      constructor() {
        super({ key: 'CenaJogoFix' });
        this.tabuadaFoco = 5;
        this.tijolosTotais = 0;
        this.fatorB = 2;
        this.filaFatores = [];
      }

      preload() {
        const gTijolo = this.make.graphics();
        gTijolo.fillStyle(0xd7ccc8);
        gTijolo.fillRect(0, 0, 40, 20);
        gTijolo.generateTexture('tijoloImg', 40, 20);

        const gZumbi = this.make.graphics();
        gZumbi.fillStyle(0x4caf50);
        gZumbi.fillRect(0, 0, 30, 50);
        gZumbi.generateTexture('zumbiImg', 30, 50);
      }

      calcularMeta() {
        if (this.tabuadaFoco === 2) return 110;
        if (this.tabuadaFoco === 3) return 159;
        if (this.tabuadaFoco === 4) return 220;
        if (this.tabuadaFoco === 5) return 275;
        if (this.tabuadaFoco === 6) return 325;
        if (this.tabuadaFoco === 7) return 385;
        if (this.tabuadaFoco === 8) return 440;
        if (this.tabuadaFoco === 9) return 495;
        if (this.tabuadaFoco === 10) return 550;
        return 0;
      }

      embaralhar(array) {
        const lista = [...array];
        for (let i = lista.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [lista[i], lista[j]] = [lista[j], lista[i]];
        }
        return lista;
      }

      proximoFator() {
        if (this.filaFatores.length === 0) {
          this.filaFatores = this.embaralhar([2, 3, 4, 5, 6, 7, 8, 9, 10]);
        }
        this.fatorB = this.filaFatores.shift();
        if (this.textoPergunta) {
          this.textoPergunta.setText(`Quanto é ${this.tabuadaFoco} x ${this.fatorB}?`);
        }
      }

      create() {
        const width = this.scale.width;
        const height = this.scale.height;

        this.cameras.main.setBackgroundColor('#1b262c');

        // Solo e Muro Base
        this.add.rectangle(width / 2, height - 20, width, 40, 0x3e2723);
        this.zumbi = this.add.sprite(120, height - 65, 'zumbiImg');
        this.muroGroup = this.add.group();
        this.add.rectangle(width - 140, height - 35, 180, 20, 0x5d4037);

        // Painel Central
        const centroX = width / 2;
        const centroY = 100;

        this.add.rectangle(centroX, centroY, 460, 150, 0x000000, 0.8)
          .setStrokeStyle(2, 0x4caf50);

        this.textoPergunta = this.add.text(centroX, centroY - 45, '', {
          fontSize: '22px',
          color: '#ffffff',
          fontStyle: 'bold'
        }).setOrigin(0.5);

        const htmlForm = `
          <div style="display: flex; gap: 8px; justify-content: center; align-items: center;">
            <input type="number" id="respostaInput" placeholder="Resposta" style="padding: 6px; font-size: 16px; width: 100px; text-align: center; border-radius: 5px; border: 1px solid #ccc; outline: none;" />
            <button id="btnConstruir" style="padding: 6px 14px; font-size: 16px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">Construir 🧱</button>
          </div>
        `;
        this.domForm = this.add.dom(centroX, centroY + 5).createFromHTML(htmlForm);

        this.textoFeedback = this.add.text(centroX, centroY + 50, '', {
          fontSize: '14px',
          fontStyle: 'bold'
        }).setOrigin(0.5);

        this.domForm.addListener('click');
        this.domForm.on('click', (event) => {
          if (event.target.id === 'btnConstruir') this.validarResposta();
        });

        setTimeout(() => {
          const inputElem = document.getElementById('respostaInput');
          if (inputElem) {
            inputElem.addEventListener('keypress', (e) => {
              if (e.key === 'Enter') this.validarResposta();
            });
          }
        }, 100);

        // HUD - Cantos
        this.textoInventario = this.add.text(16, 16, '', {
          fontSize: '15px',
          color: '#ffffff',
          backgroundColor: '#333333',
          padding: { x: 10, y: 6 }
        });

        const htmlSeletor = `
          <div style="color: white; font-family: sans-serif; font-size: 14px; background: rgba(0,0,0,0.85); padding: 5px 10px; border-radius: 5px; border: 1px solid #555;">
            <label for="tabuadaSelect" style="margin-right: 5px; font-weight: bold;">Tabuada:</label>
            <select id="tabuadaSelect" style="padding: 3px 6px; font-size: 14px; border-radius: 4px; cursor: pointer;">
              ${[2,3,4,5,6,7,8,9,10].map(n => `<option value="${n}" ${n === 5 ? 'selected' : ''}>${n}</option>`).join('')}
            </select>
          </div>
        `;
        this.domSeletor = this.add.dom(16, 58).createFromHTML(htmlSeletor).setOrigin(0, 0);

        this.domSeletor.addListener('change');
        this.domSeletor.on('change', (e) => {
          if (e.target.id === 'tabuadaSelect') {
            this.tabuadaFoco = Number(e.target.value);
            this.tijolosTotais = 0;
            this.filaFatores = [];
            this.proximoFator();
            this.atualizarHUD();
            this.desenharMuro();
          }
        });

        const btnSalvar = this.add.text(16, height - 50, '💾 Guardar', {
          fontSize: '14px',
          color: '#ffffff',
          backgroundColor: '#2196F3',
          padding: { x: 12, y: 8 }
        }).setInteractive({ useHandCursor: true });

        btnSalvar.on('pointerdown', () => aoGuardar(this.tabuadaFoco, false));

        const btnFullscreen = this.add.text(width - 16, 16, '⛶ Tela Cheia', {
          fontSize: '14px',
          color: '#ffffff',
          backgroundColor: '#555555',
          padding: { x: 10, y: 6 }
        }).setOrigin(1, 0).setInteractive({ useHandCursor: true });

        btnFullscreen.on('pointerdown', () => {
          if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => {});
          } else {
            if (document.exitFullscreen) document.exitFullscreen();
          }
        });

        this.proximoFator();
        this.atualizarHUD();
      }

      atualizarHUD() {
        const meta = this.calcularMeta();
        this.textoInventario.setText(`🧱 Tijolos: ${this.tijolosTotais} / ${meta}`);
      }

      validarResposta() {
        const inputElem = document.getElementById('respostaInput');
        if (!inputElem || inputElem.value === '') return;

        const respostaDada = parseInt(inputElem.value, 10);
        const valorCorreto = this.tabuadaFoco * this.fatorB;
        const meta = this.calcularMeta();

        if (respostaDada === valorCorreto) {
          this.tijolosTotais += valorCorreto;
          this.textoFeedback.setText('✅ Boa! Ganhou os tijolos!').setColor('#81c784');
          
          aoAcertar();
          this.atualizarHUD();
          this.desenharMuro();

          if (this.tijolosTotais >= meta) {
            alert(`Parabéns! Alcançou a meta de ${meta} tijolos!`);
            aoGuardar(this.tabuadaFoco, true);
          }
        } else {
          this.textoFeedback.setText(`❌ Tente de novo! ${this.tabuadaFoco} x ${this.fatorB} não é ${respostaDada}.`).setColor('#ff8a80');
          aoErrar({ operacao: `${this.tabuadaFoco}x${this.fatorB}`, respostaDada });
        }

        inputElem.value = '';
        this.proximoFator();
      }

      desenharMuro() {
        if (!this.muroGroup) return;
        this.muroGroup.clear(true, true);
        const { width, height } = this.scale;

        if (this.tijolosTotais === 0) {
          if (this.zumbi) this.zumbi.setX(120);
          return;
        }

        const metaAtual = this.calcularMeta();

        // 1. LÓGICA DE LARGURA EXPANSIVA
        // Se ultrapassar 200 tijolos, o muro fica mais largo (6 colunas)
        // Caso contrário, mantém-se mais estreito (3 ou 4 colunas)
        let tijolosPorLinha = 3;
        if (this.tijolosTotais > 200) {
          tijolosPorLinha = 8; // Muro bem largo para grandes quantidades
        } else if (this.tijolosTotais > 100) {
          tijolosPorLinha = 5; // Muro médio
        }

        // 2. Cálculo da altura e largura máximas disponíveis
        const linhasMaximas = Math.ceil(metaAtual / tijolosPorLinha);
        const alturaDisponivel = Math.min(220, height * 0.45); 
        const larguraDisponivel = Math.min(280, width * 0.45); // Aumentado para suportar o muro mais largo

        // 3. Tamanho dinâmico de cada bloco
        const alturaTijolo = Math.max(6, Math.min(20, Math.floor(alturaDisponivel / linhasMaximas)));
        const larguraTijolo = Math.max(10, Math.min(35, Math.floor(larguraDisponivel / tijolosPorLinha)));

        const scaleX = larguraTijolo / 40;
        const scaleY = alturaTijolo / 20;

        // 4. Posição da base calculada com base na nova largura total
        const larguraTotalMuro = tijolosPorLinha * (larguraTijolo + 2);
        const baseX = width - 40 - larguraTotalMuro;
        const baseY = height - 45;

        // 5. Renderização dos tijolos
        for (let i = 0; i < this.tijolosTotais; i++) {
          const coluna = i % tijolosPorLinha;
          const linha = Math.floor(i / tijolosPorLinha);

          const posX = baseX + (coluna * (larguraTijolo + 2));
          const posY = baseY - (linha * (alturaTijolo + 2));

          const tijolo = this.muroGroup.create(posX, posY, 'tijoloImg');
          tijolo.setScale(scaleX, scaleY);
          tijolo.setOrigin(0, 1);
        }

        // 6. Recuo do Zumbi adaptado ao novo tamanho
        if (this.zumbi) {
          const progressoPorcentagem = Math.min(1, this.tijolosTotais / metaAtual);
          const recuoMaximo = width * 0.4;
          this.zumbi.setX(120 - (progressoPorcentagem * recuoMaximo));
        }
      } 
    }

    const config = {
      type: Phaser.AUTO,
      parent: gameRef.current,
      width: 800,
      height: 480,
      dom: { createContainer: true },
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
      },
      scene: CenaJogoFix
    };

    const game = new Phaser.Game(config);

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '480px' }}>
      <div ref={gameRef} style={{ borderRadius: '10px', overflow: 'hidden', border: '2px solid #4CAF50' }} />
    </div>
  );
}