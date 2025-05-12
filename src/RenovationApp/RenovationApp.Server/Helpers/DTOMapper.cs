using RenovationApp.Server.Models;
using RenovationApp.Server.DTOs;

namespace RenovationApp.Server.Helpers
{
    public static class DTOMapper
    {


        public static ProjectTaskDTO ToDTO(this ProjectTask entity)
        {
            return new ProjectTaskDTO
            {
                Id = entity.Id,
                CreatedTimestamp = entity.CreatedTimestamp,
                ProjectId = entity.ProjectId,
                Title = entity.Title,
                Description = entity.Description,
                Status = entity.Status
            };
        }

        public static ProjectTask ToEntity(this ProjectTaskDTO dto)
        {
            return new ProjectTask
            {
                Id = dto.Id,
                ProjectId = dto.ProjectId,
                Title = dto.Title,
                Description = dto.Description,
                Status = dto.Status,
                // CreatedTimestamp is set in controller
            };
        }

        public static ProjectCommunicationDto ToDto(ProjectCommunication entity)
        {
            return new ProjectCommunicationDto
            {
                Id = entity.Id,
                CreatedTimestamp = entity.CreatedTimestamp,
                Message = entity.Message,
                ProjectId = entity.ProjectId
            };
        }
        public static ProjectCommunication ToEntity(ProjectCommunicationDto dto)
        {
            return new ProjectCommunication
            {
                Id = dto.Id,
                CreatedTimestamp = dto.CreatedTimestamp,
                Message = dto.Message,
                ProjectId = dto.ProjectId
            };
        }
        public static ClientInvoiceDto ToDto(ClientInvoice entity)
        {
            return new ClientInvoiceDto
            {
                Id = entity.Id,
                CreatedTimestamp = entity.CreatedTimestamp,
                Description = entity.Description,
                PaymentInstructions = entity.PaymentInstructions,
                Paid = entity.Paid,
                Amount = entity.Amount,
                ProjectId = entity.ProjectId
            };
        }

        public static ClientInvoice ToEntity(ClientInvoiceDto dto)
        {
            return new ClientInvoice
            {
                Id = dto.Id,
                CreatedTimestamp = dto.CreatedTimestamp,
                Description = dto.Description,
                PaymentInstructions = dto.PaymentInstructions,
                Paid = dto.Paid,
                Amount = dto.Amount,
                ProjectId = dto.ProjectId
            };
        }

        //add more mapping methods as needed
    }
}