FROM debian:wheezy
ENV DEBIAN_FRONTEND noninteractive
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Get packages
RUN apt-get update && apt-get install -y \
    sudo \
        vim \
        git \
        apache2 \
        curl \
        openssh-server \
        wget \
  librsvg2-bin \
        supervisor
RUN apt-get clean

# Apache
 RUN sed -i 's/AllowOverride None/AllowOverride All/' /etc/apache2/sites-available/default
 RUN a2enmod rewrite

# SSH
RUN echo 'root:root' | chpasswd
RUN sed -i 's/PermitRootLogin without-password/PermitRootLogin yes/' /etc/ssh/sshd_config
RUN mkdir /var/run/sshd && chmod 0755 /var/run/sshd
RUN mkdir -p /root/.ssh/ && touch /root/.ssh/authorized_keys
RUN sed 's@session\s*required\s*pam_loginuid.so@session optional pam_loginuid.so@g' -i /etc/pam.d/sshd

# Supervisor
RUN echo -e '[program:apache2]\ncommand=/bin/bash -c "source /etc/apache2/envvars && exec /usr/sbin/apache2 -DFOREGROUND"\nautorestart=true\n\n' >> /etc/supervisor/supervisord.conf
RUN echo -e '[program:sshd]\ncommand=/usr/sbin/sshd -D\n\n' >> /etc/supervisor/supervisord.conf

# Plataforma

ADD plataformacf /var/www

RUN rm /var/www/index.html

RUN chown -R $USER:$USER /var/www/
RUN chmod a+w /var/www -R

EXPOSE 80 3306 22
CMD exec supervisord -n
