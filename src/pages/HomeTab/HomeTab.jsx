import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTransactions } from "../../redux/transactions/operations";
import { selectTransactions, selectTransactionCategories, selectIsLoading, selectError, selectTotalBalance } from "../../redux/transactions/selectors";

const HomeTab = () => {
  const dispatch = useDispatch();

  const transactions = useSelector(selectTransactions);
  const categories = useSelector(selectTransactionCategories);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const totalBalance = useSelector(selectTotalBalance);

  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!transactions || transactions.length === 0) return <p>no transaction yet</p>;

  return (
    <div>
      <ul>
        {transactions.map(t => {
          const category = categories.find(c => c.id === t.categoryId);
          return (
            <li key={t.id}>
              <strong>{t.transactionDate}</strong> | {t.type} | {category?.name || t.categoryId} | {t.comment} - {t.amount} ₺
            </li>
          );
        })}
      </ul>
      <p>
        <strong>total balance: </strong>{totalBalance} ₺
      </p>
    </div>
  );
};

export default HomeTab;
