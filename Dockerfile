FROM python:3.10

WORKDIR /back

COPY . .

RUN chmod +x entrypoint.sh
RUN pip install -r requirements.txt

EXPOSE 8000:8000

ENTRYPOINT [ "./entrypoint.sh" ]