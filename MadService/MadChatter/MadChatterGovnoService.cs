using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MadService.MadChatter
{
    public class MadChatterGovnoService : IMadChatterService
    {
        public string ReplaceSomeWords(string message)
        {
            var words = message.Split(' ');

            for (int i = 0; i < words.Length; i++)
            {
                if (words[i] == "Я")
                {
                    words[i] = "Говно";
                }
            }

            return String.Join(" ", words);
        }
    }
}
