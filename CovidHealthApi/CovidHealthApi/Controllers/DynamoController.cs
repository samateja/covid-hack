using Microsoft.AspNetCore.Mvc;
using CovidHealthApi.ApplicationDbContext;
using System;

namespace CovidHealthApi.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [ApiController]
    public class DynamoController : ControllerBase
    {       
        readonly IDbContext _dbContext;

        public DynamoController(IDbContext dbContext )
        {
            _dbContext = dbContext;
        }

        [HttpGet]
        [Route("{name}")]
        public ActionResult Get(string name)
        {
            try
            {
                var data = _dbContext.GetAll(name);
                return Ok(data);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}