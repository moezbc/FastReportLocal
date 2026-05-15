FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    unixodbc-dev \
    libaio1 \
    libaio-dev \
    wget \
    unzip \
    && mkdir -p /opt/oracle \
    && wget https://download.oracle.com/otn_software/linux/instantclient/1924000/instantclient-basiclite-linux.x64-19.24.0.0.0dbru.zip -O /opt/oracle/instantclient.zip \
    && unzip /opt/oracle/instantclient.zip -d /opt/oracle \
    && rm /opt/oracle/instantclient.zip \
    && mv /opt/oracle/instantclient_19_24 /opt/oracle/instantclient \
    && echo /opt/oracle/instantclient > /etc/ld.so.conf.d/oracle-instantclient.conf \
    && ldconfig \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000
