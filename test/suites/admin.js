
module.exports = (g) => {
  const r = g.chai.request(g.baseurl)

  return describe('admin routes', () => {
    //
    it('must return index html', async () => {
      const res = await r.get('/index.html')
      res.should.have.status(200)
    })

    it('must return index html', async () => {
      const res = await r.get('/settings.json')
      res.should.have.status(200)
    })

  })
}
