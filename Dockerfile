#
# MIT License
#
# Copyright (c) 2023-2024 Tracehub.git
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
#

FROM node:20-alpine AS builder
WORKDIR /action
COPY package*.json ./
RUN npm run build
RUN npm run package
COPY tsconfig*.json ./
COPY src/ src/
RUN npm run build \
  && npm prune --production

FROM node:20-alpine
RUN apk add --no-cache tini
COPY --from=builder action/package.json .
COPY --from=builder action/lib lib/
COPY --from=builder action/node_modules node_modules/
ENTRYPOINT [ "/sbin/tini", "--", "node", "/lib/index.js" ]
