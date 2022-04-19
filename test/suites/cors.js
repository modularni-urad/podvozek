
module.exports = (g) => {
  const r = g.chai.request(g.baseurl)

  return describe('admin routes', () => {
    //
    it('must return index html', async () => {
      const res = await r.options('/paro/1')
        .set('accept', 'json')
        .set('referer', 'http://localhost/')
      res.should.have.status(204)
      g.chai.expect(res).to.have.header('access-control-allow-credentials', 'true')
    })

  })
}
