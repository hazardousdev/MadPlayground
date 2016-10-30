using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MadBinding.Models;
using NHibernate;
using MadBinding.Repositories;
using NHibernate.Criterion;

namespace MadBinding.Managers
{
    //public class FileManager : IFileManager
    //{
        //public void Add(FileCreateORMModel item)
        //{
        //    using (ISession session = NHibernateHelper.OpenSession())
        //    {
        //        using (ITransaction transaction = session.BeginTransaction())
        //        {
        //            session.Save(item);
        //            transaction.Commit();
        //        }
        //    }
        //}

        //public void Delete(Guid fileId)
        //{
        //    using (ISession session = NHibernateHelper.OpenSession())
        //    {
        //        using (ITransaction transaction = session.BeginTransaction())
        //        {
        //            var criteria = session.CreateCriteria(typeof(FileViewORMModel));

        //            criteria.Add(Restrictions.Where<FileViewORMModel>(f => f.Id == fileId));

        //            var files = criteria.List<FileViewORMModel>();
        //            session.Delete(files.FirstOrDefault());
        //            transaction.Commit();
        //        }
        //    }
        //}

        //public FileCreateORMModel GetFile(Guid fileId)
        //{
        //    using (ISession session = NHibernateHelper.OpenSession())
        //    {
        //        var criteria = session.CreateCriteria(typeof(FileCreateORMModel));

        //        criteria.Add(Restrictions.Where<FileCreateORMModel>(f => f.Id == fileId));

        //        return criteria.UniqueResult<FileCreateORMModel>();
        //    }
        //}

        //public IEnumerable<FileViewORMModel> List(String sort, String dir)
        //{
        //    using (ISession session = NHibernateHelper.OpenSession())
        //    {
        //        var criteria = session.CreateCriteria(typeof(FileViewORMModel));

        //        if (sort != null && dir != null)
        //        {
        //            switch (sort)
        //            {
        //                case "name":
        //                    if (dir == "asc")
        //                    {
        //                        criteria.AddOrder(Order.Asc("FileName"));
        //                    }
        //                    else
        //                    {
        //                        criteria.AddOrder(Order.Desc("FileName"));
        //                    }
        //                    break;
        //                case "date":
        //                    if (dir == "asc")
        //                    {
        //                        criteria.AddOrder(Order.Asc("CreationDate"));
        //                    }
        //                    else
        //                    {
        //                        criteria.AddOrder(Order.Desc("CreationDate"));
        //                    }
        //                    break;
        //                case "mail":
        //                    if (dir == "asc")
        //                    {
        //                        criteria.AddOrder(Order.Asc("AuthorName"));
        //                    }
        //                    else
        //                    {
        //                        criteria.AddOrder(Order.Desc("AuthorName"));
        //                    }
        //                    break;
        //            }
        //        }
        //        else
        //        {
        //            criteria.AddOrder(Order.Asc("CreationDate"));
        //        }

        //        var files = criteria.List<FileViewORMModel>();

        //        return files;
        //    }
        //}
    //}
}
