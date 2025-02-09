﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Ecommerce.Models.Dtos;


namespace Ecommerce.Models.Database.Entities;

[Index(nameof(Id), IsUnique = true)]

public class TemporalOrder
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    public string PaymentMethod { get; set; } = null!;

    public decimal TotalPrice { get; set; }

    // tiempo de expiracion
    public DateTime ExpiresAt { get; set; }
    public bool Express { get; set; }

    public int? UserId { get; set; }

    public ICollection<TemporalProductOrder> TemporalProductOrder { get; set; } = new List<TemporalProductOrder>();

    public User User { get; set; } // habria que hacer dto para q no salga info del usuario

}
