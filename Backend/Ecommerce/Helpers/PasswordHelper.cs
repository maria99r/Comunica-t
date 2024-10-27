using System.Security.Cryptography;
using System.Text;

namespace Ecommerce.Helpers;

internal class PasswordHelper
{
    public static string Hash(string password)
    {
        byte[] inputBytes = Encoding.UTF8.GetBytes(password);
        byte[] inputHash = SHA256.HashData(inputBytes);
        return Encoding.UTF8.GetString(inputHash);
    }

    public static bool Verify(string password, string hashedPassword)
    {
        // Hashea la contraseña introducida por el usuario
        string hashedInputPassword = Hash(password);

        // La compara con la contraseña hasheada de la BBDD
        return hashedInputPassword == hashedPassword;
    }
}
