# Entacl Template

Vue.jsなどのSPAを使用しない、モダンなWeb開発のためのテンプレートプロジェクトです。
Gulp、Webpack、Sass、EJSを使用して効率的な開発環境を提供します。

## 🚀 機能

- **Gulp**: タスクランナーによる自動化
- **Webpack**: JavaScriptのバンドルとモジュール管理
- **Sass**: CSSプリプロセッサー
- **EJS**: HTMLテンプレートエンジン
- **Browser-Sync**: ライブリロード機能
- **画像最適化**: WebP変換、画像圧縮
- **ライブラリ管理**: npmパッケージの統合

## 使用技術

### 主要な依存関係
- **Gulp 4.0.2**: タスクランナー
- **Webpack 5.97.1**: モジュールバンドラー
- **Sass 1.83.4**: CSSプリプロセッサー
- **Browser-Sync 3.0.3**: 開発サーバー
- **Swiper 11.2.10**: スライダーライブラリ
- **Three.js 0.173.0**: 3Dグラフィックスライブラリ

### 開発ツール
- **Babel**: JavaScriptトランスパイラー
- **gulp-sass**: Sassコンパイル
- **gulp-ejs**: EJSテンプレート処理
- **gulp-imagemin**: 画像最適化
- **gulp-webp**: WebP変換

## ⚙️ セットアップ

### 前提条件
- Node.js (推奨: v16以上)
- npm

### インストール
```bash
# リポジトリをクローン
git clone [repository-url]
cd [project-name]

# 依存関係をインストール
npm install
```

## 📁 プロジェクト構造

```
├── src/                    # ソースファイル
│   ├── ejs/               # EJSテンプレート
│   ├── sass/              # Sassファイル
│   ├── js/                # JavaScriptファイル
│   └── config/            # 設定ファイル
├── develop/               # 開発用ビルド出力
├── release/               # 本番用ビルド出力
├── setting/               # 設定ファイル
│   └── webpack.config.js  # Webpack設定
├── gulpfile.js           # Gulp設定
└── package.json          # プロジェクト設定
```

##  使用方法

### 開発サーバー起動
```bash
npm run d
# または
gulp d
```
- Browser-Syncが起動し、ライブリロード機能が有効になります
- デフォルトで外部アクセス可能なURLが表示されます

### 本番ビルド
```bash
npm run r
# または
gulp r
```
- ファイルの最適化、圧縮、WebP変換を行います
- release/ディレクトリに出力されます

### 個別タスク

#### 画像最適化
```bash
gulp imagemin
```

#### WebP変換
```bash
gulp webp
```

## 🔧 設定

### Gulpタスク
- `gulp d`: 開発サーバー起動
- `gulp l`: ライブラリ統合
- `gulp r`: 本番ビルド
- `gulp imagemin`: 画像最適化
- `gulp webp`: WebP変換

### ファイル監視
開発サーバー起動中は以下のファイルが自動監視されます：
- `src/ejs/**/*.ejs`: EJSテンプレート
- `src/sass/**/*.scss`: Sassファイル
- `src/js/**/*.js`: JavaScriptファイル

##  開発ガイドライン

### Sassの使用
- `@use`を使用してモジュールを読み込みます（`@import`は非推奨）
- 設定ファイルは`src/sass/setting/`に配置
- 共通スタイルは`src/sass/share.scss`に記述

### JavaScriptの開発
- ES6+の構文が使用可能（Babelでトランスパイル）
- Webpackによるモジュール管理
- ライブラリはnpmで管理

### テンプレート開発
- EJSを使用したHTMLテンプレート
- 設定は`src/config/`で管理

##  デプロイ

本番環境へのデプロイは`release/`ディレクトリの内容を使用してください。

```bash
# 本番ビルドを実行
npm run r

# release/ディレクトリの内容をサーバーにアップロード
```

##  git運用の注意点

- developフォルダ以下のgulpfileによって毎回変換が行われる`css、js、html`ファイルはpushしない。
pushしてしまうとpushやpullの際に毎回衝突してしまう為
- commitのコメントは下記で統一
```bash
対応ページ、箇所：対応内容
```


---