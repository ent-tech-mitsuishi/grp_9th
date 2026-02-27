FROM php:8.2-apache

# bzip2拡張に必要なライブラリをインストール
RUN apt-get update && apt-get install -y libbz2-dev && rm -rf /var/lib/apt/lists/*

# bz2拡張をインストール
RUN docker-php-ext-install bz2

# 作業ディレクトリを設定
WORKDIR /var/www/html

# Apacheのドキュメントルートをphpディレクトリに設定
ENV APACHE_DOCUMENT_ROOT /var/www/html/php

# Apache設定を変更
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf
RUN sed -ri -e 's!/var/www/!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# mod_rewriteを有効化（必要に応じて）
RUN a2enmod rewrite

# assetsのAlias設定をコピー
COPY apache-assets.conf /etc/apache2/conf-available/assets.conf
RUN a2enconf assets

# ポート80を公開
EXPOSE 80

# Apacheをフォアグラウンドで起動
CMD ["apache2-foreground"]
