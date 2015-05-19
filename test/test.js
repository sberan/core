import {expect} from 'chai'
import { Server, Environment, HttpServer }  from '../src/Server'
import http from 'http'

const port = 8888;

describe('Server', () => {

  let server
  beforeEach(() => {
    server = new Server(new HttpServer)
    server.use(env => env.next())
  })

  afterEach(() => {
    return server.close()
  })

  describe('listen', () => {
    it('returns a promise, creates a server', async () => {
      server.listen(port)
      expect(server.webserver).to.be.an.instanceOf(HttpServer)
    })

    it('throws if called twice', async () => {
      await server.listen(port)
      try {
        await server.listen(port)
        throw 'not an error'
      } catch (e){
        expect(e).to.be.an.instanceOf(Error)
      }
    })

    it('sets argument to an Environment instance', async () => {
      server.use(env => {
        expect(env).to.be.an.instanceOf(Environment)
        env.response.end()
      })
      return server.listen(8080)
        .then(() => new Promise(res => http.get('http://localhost:8080', res)))
    })
  })

  describe('close', () => {
    it('calls close on underlying webserver implementation', () => {
      let called = false
      server.webserver.close = function (){ called = true }
      server.close();
      expect(called).to.be.true
    })
  })
})

