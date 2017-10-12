##### Section 1: Common across all grmtech docker containers. #####
# Q) Why do we keep the following common across all grmtech docker containers?
#  Due to UFS on any physical server the download of ubuntu image/upgrading it and installating telnet ping ifconfig and supervisor will happen only once.
# Q) Why do we use a single RUN statement instead of 4 different?
#  To reduce the numner of aufs layers. Instead of 4 this will create 1 layer. Advantages of reducing 3 aufs layers:
#  1. Faster build
#  2. Easier to debug since the number of layers is less it is easier to understand what is happening.
FROM ubuntu:16.04
RUN apt-get update && \
 apt-get -y upgrade && \
 apt-get install -y telnet inetutils-ping net-tools --no-install-recommends && \
 DEBIAN_FRONTEND=noninteractive apt-get install -y supervisor --no-install-recommends 

# Q) Why am I exporting the environment variable TERM=screen?
#  1. clear gives the error message TERM environment variable not set.
#  2. ls command will not show dirs in a different color.
ENV TERM screen

##### Section 2: Container specific packages #####
RUN apt install -y nginx


# following are needed for bower to be run from supervisor
RUN apt install -y nodejs npm nodejs-legacy git
RUN npm install -g bower

# What does expose do?
# The EXPOSE instruction informs Docker that the container listens on the specified network ports at runtime. EXPOSE does not make the ports of the container accessible to the host.
# To do that, you must use either the -p flag to publish a range of ports or the -P flag to publish all of the exposed ports.
# Expose port 443 for https

Expose 80

# Docker container runs as long as the command you specify with CMD, ENTRTYPOINT or through the command line is running. 
# Setting deamon off so that nginx runs in the foreground and does not exit.
# I am using CMD instead of entrypoing since CMD can be overridden on the command line easily
# ref: https://www.ctl.io/developers/blog/post/dockerfile-entrypoint-vs-cmd/
# nginx has to be last command since it is running in daemon off. Hence it never returns control and hence if service redis-server start is specified after nginx it will not start.
CMD ["/usr/bin/supervisord", "-n","-c","/etc/supervisor/supervisord.conf"]
