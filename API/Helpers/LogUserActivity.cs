using System;
using API.Data;
using API.Extensions;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;

namespace API.Helpers;

public class LogUserActivity : IAsyncActionFilter
{
     private readonly ILogger<LogUserActivity> _logger;

    // 注入 ILogger
    public LogUserActivity(ILogger<LogUserActivity> logger)
    {
        _logger = logger;
    }
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var resultContext = await next();

        if (context.HttpContext.User.Identity?.IsAuthenticated != true) return;

        var memberId = resultContext.HttpContext.User.GetMemberId();

        var dbContext = resultContext.HttpContext.RequestServices
            .GetRequiredService<AppDbContext>();

        await dbContext.Members
            .Where(x => x.Id == memberId)
            .ExecuteUpdateAsync(setters => setters.SetProperty(x => x.LastActive, DateTime.UtcNow));

          // 假设你有这个扩展方法
        _logger.LogInformation("User activity updated for member: {MemberId}, Email: xxxxxxxxxxxxxxxxxx", memberId);
    }
}
