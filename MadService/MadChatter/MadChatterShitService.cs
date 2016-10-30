using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MadService.MadChatter
{
    public class MadChatterShitService : IMadChatterService
    {
        public string ReplaceSomeWords(string message)
        {
            var words = message.Split(' ');

            for (int i = 0; i < words.Length; i++)
            {
                if (words[i] == "I")
                {
                    words[i] = "Shit";
                }
            }

            return String.Join(" ", words);
        }
    }
}
