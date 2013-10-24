[assembly: WebActivator.PreApplicationStartMethod(typeof(satin_regional_proto.App_Start.SquishItLess), "Start")]

namespace satin_regional_proto.App_Start
{
    using SquishIt.Framework;
    using SquishIt.Less;

    public class SquishItLess
    {
        public static void Start()
        {
            Bundle.RegisterStylePreprocessor(new LessPreprocessor());
        }
    }
}