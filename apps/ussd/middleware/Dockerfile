FROM ubuntu:latest
RUN apt-get update && apt-get -y install cron git
RUN apt-get install -y python3-pip python3-venv

RUN mkdir /usr/share/data
WORKDIR  /usr/share/data

# Fix externally-managed-environment error
RUN python3 -m venv /usr/share/data/venv

#Copy relevant files and run python requirements
COPY pull_zammad_kb_script.py /usr/share/data
COPY push_to_ussd_postgres_db_script.py /usr/share/data
COPY .env /usr/share/data
COPY requirements.txt /usr/share/data
# Fix externally-managed-environment error
RUN /usr/share/data/venv/bin/pip install --upgrade pip setuptools
RUN /usr/share/data/venv/bin/pip install -r requirements.txt
# RUN pip3 install --upgrade setuptools
# RUN pip3 install -r requirements.txt
#RUN python3 /usr/share/data/pull_zammad_kb_script.py

# Copy git-update file to the cron.d directory
COPY cron-jobs /etc/cron.d/cron-jobs
# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/cron-jobs
RUN touch /var/log/cron.log
# Apply cron job
RUN crontab /etc/cron.d/cron-jobs > /var/log/cron.log


# Create the log file to be able to run tail


# Run the command on container startup
#CMD echo "test1" && cron -f -L1 >> /var/log/cron.log && tail -f /var/log/cron.log > /dev/stdout
CMD cron -f -L1