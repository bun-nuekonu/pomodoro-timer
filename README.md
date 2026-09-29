# tempo.

Vue 3 と TypeScript で作った、スマートフォン向けポモドーロタイマーです。

## 開発

```sh
npm install
npm run dev
```

本番向けの型チェックとビルドは `npm run build` で実行します。生成物は `dist/` に出力されます。

## MVPの仕様

- 作業 25 分、短い休憩 5 分、作業 4 回ごとに長い休憩 15 分
- 開始、一時停止・再開、現在の区間のやり直し
- 区間が終わったら完了状態を表示し、ボタンを押すまで次の区間を開始しない
- 設定や履歴は保存しない。ページを開き直すと作業 25 分から始まる
- 本番ビルドにはオフライン用のService Workerを含める

## コードの見取り図

```text
src/
├── components/       # 円形タイマー、操作ボタン、サイクル表示
├── composables/      # タイマーの状態と動作
├── constants/        # 区間の時間とサイクル回数
├── styles/           # 色、文字、共通のリセット
├── types/            # TypeScriptの型
└── utils/            # 秒数を mm:ss にする処理
```

- `App.vue` は各コンポーネントを配置し、画面の向きに合わせたレイアウトを担当します。
- `usePomodoroTimer.ts` はタイマーの状態遷移を担当します。残り時間は、一定間隔で1秒ずつ引くのではなく、終了予定時刻と現在時刻の差から計算します。バックグラウンド中にブラウザーの更新が間引かれても、戻ったときに残り時間を合わせられます。
- `TimerDial.vue` はSVGの円を描き、残り時間に応じて円周の長さを縮めます。
- `vite.config.ts` は本番ビルド時にService Workerを生成し、アプリ画面と生成済みファイルを初回アクセス後にキャッシュします。

## Vue / TypeScript の学習ポイント

- `ref` は画面と連動する状態、`computed` は状態から導く値に使います。
- `defineProps` と `defineEmits` で、親コンポーネントと子コンポーネントの受け渡しを型付きで定義します。
- `TimerPhase` と `TimerStatus` は取りうる値を限定するユニオン型です。
- タイマーの計算と画面表示を分け、コンポーネントが小さな役割を持つ構成にしています。

## エディター

VS Code では公式の [Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar) 拡張機能を使うと、`.vue` ファイル内のTypeScript補完が使えます。
