using System;
using System.Collections.Generic;
using CovidHealthApi.ApplicationDbContext;
using CovidHealthApi.Models;
using Microsoft.AspNetCore.Mvc;

namespace CovidHealthApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        readonly IDbContext _dbContext;

        public FeedbackController(IDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // POST api/values
        [HttpPost]
        public ActionResult Post(FeedbackData feedback)
        {
            try
            { 
                return Ok(_dbContext.AddFeedback(feedback));
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        
    }
}
