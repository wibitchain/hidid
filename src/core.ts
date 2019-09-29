import * as getRawBody from 'raw-body';
import * as Koa from 'koa';
import * as Router from 'koa-router';
import {
  DsLinkConfig,
  DsLinkCore,
  DsLinkResponse,
  DsLinkResponseModel
} from '@decentralized-identity/DsLink';
import { ProtocolVersionModel } from '@decentralized-identity/DsLink/dist/lib/core/VersionManager';

/** Configuration used by this server. */
interface ServerConfig extends DsLinkConfig {
  /** Port to be used by the server. */
  port: number;
}

const config: ServerConfig = require('../json/core-config.json');
const protocolVersions: ProtocolVersionModel[] = require('../json/core-protocol-versioning.json');

const DsLinkCore = new DsLinkCore(config, protocolVersions);
const app = new Koa();

// Raw body parser.
app.use(async (ctx, next) => {
  ctx.body = await getRawBody(ctx.req);
  await next();
});

const router = new Router();
router.post('/', async (ctx, _next) => {
  const response = await DsLinkCore.handleOperationRequest(ctx.body);
  setKoaResponse(response, ctx.response);
});

router.get('/version', async (ctx, _next) => {
  const response = await DsLinkCore.handleGetVersionRequest();
  setKoaResponse(response, ctx.response);
});

router.get('/:didOrDidDocument', async (ctx, _next) => {
  const response = await DsLinkCore.handleResolveRequest(ctx.params.didOrDidDocument);
  setKoaResponse(response, ctx.response);
});

app.use(router.routes())
   .use(router.allowedMethods());

// Handler to return bad request for all unhandled paths.
app.use((ctx, _next) => {
  ctx.response.status = 400;
});

DsLinkCore.initialize()
.then(() => {
  const port = config.port;
  app.listen(port, () => {
    console.log(`DsLink node running on port: ${port}`);
  });
})
.catch((error: Error) => {
  console.log(`DsLink node initialization failed with error ${error}`);
});

/**
 * Sets the koa response according to the DsLink response object given.
 */
const setKoaResponse = (response: DsLinkResponseModel, koaResponse: Koa.Response) => {
  koaResponse.status = DsLinkResponse.toHttpStatus(response.status);

  if (response.body) {
    koaResponse.set('Content-Type', 'application/json');
    koaResponse.body = response.body;
  } else {
    // Need to set the body explicitly to empty string, else koa will echo the request as the response.
    koaResponse.body = '';
  }
};
